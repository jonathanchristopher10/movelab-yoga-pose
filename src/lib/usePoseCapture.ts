import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'error';

export interface HoldResult {
  /** Average per-frame motion over the hold (0 = perfectly still). Feeds scoreFromMotion. */
  motion: number;
  /** JPEG data URL of the steadiest captured frame, or null if none could be grabbed. */
  photo: string | null;
  /** Number of motion samples collected. */
  samples: number;
  /** True if the camera looked covered/empty for most of the hold → prompt a retry. */
  covered: boolean;
}

// Small buffer used only for motion math — tiny so per-frame diffing is cheap.
const MOTION_W = 64;
const MOTION_H = 48;
const SAMPLE_INTERVAL_MS = 90; // ~11 fps sampling
const DARK_LUMA = 12; // frames darker than this (covered lens / empty) count as "absent"

/**
 * Owns the webcam and the stability measurement for the Capture screen.
 * App drives the timeline: startCamera() on entry, startHold() when the prep
 * countdown ends, finishHold() when the 8s are up.
 */
export function usePoseCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');

  // Sampling state (refs so the rAF loop reads fresh values without re-subscribing).
  const samplingRef = useRef(false);
  const rafRef = useRef(0);
  const lastSampleAtRef = useRef(0);
  const prevLumaRef = useRef<Uint8ClampedArray | null>(null);
  const motionSumRef = useRef(0);
  const sampleCountRef = useRef(0);
  const darkCountRef = useRef(0);
  const minMotionRef = useRef(Infinity);
  const bestPhotoRef = useRef<string | null>(null);

  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const getMotionCtx = () => {
    if (!motionCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = MOTION_W;
      c.height = MOTION_H;
      motionCanvasRef.current = c;
    }
    return motionCanvasRef.current.getContext('2d', { willReadFrequently: true });
  };

  const startCamera = useCallback(async () => {
    if (streamRef.current) return; // already running
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus('ready');
    } catch (err) {
      const name = (err as DOMException)?.name;
      setStatus(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error');
    }
  }, []);

  const stopCamera = useCallback(() => {
    samplingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  }, []);

  const sample = useCallback((ts: number) => {
    if (!samplingRef.current) return;
    rafRef.current = requestAnimationFrame(sample);

    if (ts - lastSampleAtRef.current < SAMPLE_INTERVAL_MS) return;
    lastSampleAtRef.current = ts;

    const video = videoRef.current;
    const ctx = getMotionCtx();
    if (!video || !ctx || video.readyState < 2) return;

    ctx.drawImage(video, 0, 0, MOTION_W, MOTION_H);
    const { data } = ctx.getImageData(0, 0, MOTION_W, MOTION_H);
    const luma = new Uint8ClampedArray(MOTION_W * MOTION_H);
    let lumaSum = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const y = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) | 0;
      luma[p] = y;
      lumaSum += y;
    }
    const meanLuma = lumaSum / luma.length;

    const prev = prevLumaRef.current;
    if (prev) {
      let diff = 0;
      for (let p = 0; p < luma.length; p++) diff += Math.abs(luma[p] - prev[p]);
      const motion = diff / luma.length / 255; // normalize to [0,1]
      motionSumRef.current += motion;
      sampleCountRef.current += 1;
      if (meanLuma < DARK_LUMA) darkCountRef.current += 1;

      // Remember the steadiest moment and grab a full-res photo there.
      if (sampleCountRef.current > 2 && motion < minMotionRef.current) {
        minMotionRef.current = motion;
        bestPhotoRef.current = grabPhoto(video);
      }
    }
    prevLumaRef.current = luma;
  }, []);

  const grabPhoto = (video: HTMLVideoElement): string | null => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return null;
    if (!photoCanvasRef.current) photoCanvasRef.current = document.createElement('canvas');
    const canvas = photoCanvasRef.current;
    // Capture a 3:4 portrait crop centered on the frame to match the PhotoFrame.
    const targetRatio = 3 / 4;
    let sw = vw;
    let sh = Math.round(vw / targetRatio);
    if (sh > vh) {
      sh = vh;
      sw = Math.round(vh * targetRatio);
    }
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.86);
  };

  const startHold = useCallback(() => {
    prevLumaRef.current = null;
    motionSumRef.current = 0;
    sampleCountRef.current = 0;
    darkCountRef.current = 0;
    minMotionRef.current = Infinity;
    bestPhotoRef.current = null;
    lastSampleAtRef.current = 0;
    samplingRef.current = true;
    rafRef.current = requestAnimationFrame(sample);
  }, [sample]);

  const finishHold = useCallback((): HoldResult => {
    samplingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    const samples = sampleCountRef.current;
    const motion = samples > 0 ? motionSumRef.current / samples : 1;
    const covered = samples === 0 || darkCountRef.current > samples * 0.6;
    // If nothing was captured (e.g. very short hold), grab a final frame now.
    const photo = bestPhotoRef.current ?? (videoRef.current ? grabPhoto(videoRef.current) : null);
    return { motion, photo, samples, covered };
  }, []);

  // Clean up on unmount.
  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, status, startCamera, stopCamera, startHold, finishHold };
}
