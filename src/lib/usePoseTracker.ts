import { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker, type MPMask, type NormalizedLandmark } from '@mediapipe/tasks-vision';
import { POSES, type Pose } from './poses';
import { poseAngles, angleMatch, landmarksPresent } from './poseMatch';

export type CameraStatus = 'idle' | 'loading' | 'requesting' | 'ready' | 'denied' | 'error';

/** Which live overlay to draw over the camera. */
export type OverlayMode = 'outline' | 'skeleton';

export interface HoldResult {
  /** Pose-match score 0..100 (how well the held pose matched the target). */
  score: number;
  /** JPEG data URL of the best-matching frame, or null. */
  photo: string | null;
  /** Number of scored frames where a person was detected. */
  samples: number;
  /** True if no person was detected for most of the hold → prompt a retry. */
  covered: boolean;
}

// Bundled offline (see public/mediapipe + public/models); no network at runtime.
const WASM_PATH = '/mediapipe/wasm';
const MODEL_PATH = '/models/pose_landmarker_lite.task';

// Sage (matches --sage accent). RGB for the body outline.
const OUTLINE_RGB = [169, 185, 154] as const;
const SAGE = 'rgb(169,185,154)';
const JOINT_COLOR = '#FFFFFF';
const MASK_THRESHOLD = 0.7; // person-confidence cutoff
const EDGE_BLUR = 10; // ring thickness at mask resolution (px); larger = thicker outline

/** Owns the webcam + MediaPipe pose tracking for the Capture screen: draws the
 *  person's glowing silhouette (segmentation mask) and scores the held pose
 *  against the selected target (joint angles). */
export function usePoseTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const targetAnglesRef = useRef<Record<string, number[]>>({});
  const poseIdRef = useRef<Pose['id']>('tree');
  const modeRef = useRef<OverlayMode>('outline');

  const rafRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const scoringRef = useRef(false);

  // Scoring accumulators.
  const matchSumRef = useRef(0);
  const matchCountRef = useRef(0);
  const presentCountRef = useRef(0);
  const frameCountRef = useRef(0);
  const bestMatchRef = useRef(-1);
  const bestPhotoRef = useRef<string | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringCanvasRef = useRef<HTMLCanvasElement | null>(null);

  /** Load MediaPipe once and derive each pose's target angles from its ref photo. */
  const ensureLoaded = useCallback(async () => {
    if (landmarkerRef.current) return;
    setStatus((s) => (s === 'idle' ? 'loading' : s));
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

    // Derive target angles from the reference photos (IMAGE mode), once.
    const imageLm = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
      runningMode: 'IMAGE',
      numPoses: 1,
    });
    for (const pose of POSES) {
      try {
        const img = await loadImage(pose.refPhoto);
        const res = imageLm.detect(img);
        const lm = res.landmarks?.[0];
        if (lm) targetAnglesRef.current[pose.id] = poseAngles(lm);
      } catch {
        /* leave undefined; match will fall back gracefully */
      }
    }
    imageLm.close();

    landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numPoses: 1,
      outputSegmentationMasks: true,
    });
  }, []);

  const setPose = useCallback((pose: Pose) => {
    poseIdRef.current = pose.id;
  }, []);

  const setOverlayMode = useCallback((mode: OverlayMode) => {
    modeRef.current = mode;
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    try {
      await ensureLoaded();
    } catch {
      setStatus('error');
      return;
    }
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => {});
      }
      setStatus('ready');
      lastVideoTimeRef.current = -1;
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      const name = (err as DOMException)?.name;
      setStatus(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error');
    }
  }, [ensureLoaded]);

  const stopCamera = useCallback(() => {
    scoringRef.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    const c = overlayRef.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    setStatus('idle');
  }, []);

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame(loop);
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) return;
    if (video.currentTime === lastVideoTimeRef.current) return;
    lastVideoTimeRef.current = video.currentTime;

    const result = landmarker.detectForVideo(video, performance.now());
    const lm = result.landmarks?.[0];
    const mask = result.segmentationMasks?.[0];
    if (modeRef.current === 'skeleton') drawSkeleton(lm);
    else drawOutline(mask);
    mask?.close();

    if (scoringRef.current) {
      frameCountRef.current += 1;
      if (landmarksPresent(lm)) {
        presentCountRef.current += 1;
        const target = targetAnglesRef.current[poseIdRef.current];
        const m = target ? angleMatch(poseAngles(lm!), target) : 0;
        matchSumRef.current += m;
        matchCountRef.current += 1;
        if (m > bestMatchRef.current && video.videoWidth) {
          bestMatchRef.current = m;
          bestPhotoRef.current = grabPhoto(video);
        }
      }
    }
  }, []);

  /** Trace the person's segmentation mask into a glowing sage OUTLINE (interior
   *  transparent, so the person stays fully visible to pose). The ring is made by
   *  blurring the filled mask and punching out the sharp mask, leaving only the
   *  edge band. Mapped through the same cover/mirror transform as the camera. */
  const drawOutline = (mask: MPMask | undefined) => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !video || !ctx) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    if (!mask || !video.videoWidth) return;

    const mw = mask.width;
    const mh = mask.height;
    const conf = mask.getAsFloat32Array();

    // 1) Solid (hard-edged) sage silhouette at mask resolution.
    const solid = (maskCanvasRef.current ??= document.createElement('canvas'));
    solid.width = mw;
    solid.height = mh;
    const sctx = solid.getContext('2d');
    if (!sctx) return;
    const img = sctx.createImageData(mw, mh);
    const d = img.data;
    for (let i = 0, p = 0; i < conf.length; i++, p += 4) {
      if (conf[i] > MASK_THRESHOLD) {
        d[p] = OUTLINE_RGB[0];
        d[p + 1] = OUTLINE_RGB[1];
        d[p + 2] = OUTLINE_RGB[2];
        d[p + 3] = 255;
      }
    }
    sctx.putImageData(img, 0, 0);

    // 2) Ring = blurred silhouette MINUS the sharp silhouette → just the edge band.
    const ring = (ringCanvasRef.current ??= document.createElement('canvas'));
    ring.width = mw;
    ring.height = mh;
    const rctx = ring.getContext('2d');
    if (!rctx) return;
    rctx.clearRect(0, 0, mw, mh);
    rctx.globalCompositeOperation = 'source-over';
    rctx.filter = `blur(${EDGE_BLUR}px)`;
    rctx.drawImage(solid, 0, 0);
    rctx.filter = 'none';
    rctx.globalCompositeOperation = 'destination-out';
    rctx.drawImage(solid, 0, 0);
    rctx.globalCompositeOperation = 'source-over';

    // 3) Cover-map the ring onto the displayed video area, with a soft glow.
    const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight);
    const dw = video.videoWidth * scale;
    const dh = video.videoHeight * scale;
    const ox = (cw - dw) / 2;
    const oy = (ch - dh) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    // Glow amount is set by this halo pass — raise blur/alpha for more glow, lower
    // for less. Line thickness is EDGE_BLUR (independent of glow).
    ctx.globalAlpha = 0.22; // subtle halo
    ctx.filter = 'blur(6px)';
    ctx.drawImage(ring, ox, oy, dw, dh);
    ctx.globalAlpha = 0.95; // crisp line
    ctx.filter = 'blur(0.5px)';
    ctx.drawImage(ring, ox, oy, dw, dh);
    ctx.restore();
  };

  /** Classic "stick man": connect the landmarks with sage lines + white joints,
   *  mapped through the same cover/mirror transform as the camera. */
  const drawSkeleton = (lm: NormalizedLandmark[] | undefined) => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !video || !ctx) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    if (!lm || !video.videoWidth) return;

    const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight);
    const dw = video.videoWidth * scale;
    const dh = video.videoHeight * scale;
    const ox = (cw - dw) / 2;
    const oy = (ch - dh) / 2;
    const px = (p: NormalizedLandmark) => ox + p.x * dw;
    const py = (p: NormalizedLandmark) => oy + p.y * dh;

    ctx.strokeStyle = SAGE;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (const { start, end } of PoseLandmarker.POSE_CONNECTIONS) {
      const a = lm[start];
      const b = lm[end];
      if (!a || !b) continue;
      ctx.beginPath();
      ctx.moveTo(px(a), py(a));
      ctx.lineTo(px(b), py(b));
      ctx.stroke();
    }
    ctx.fillStyle = JOINT_COLOR;
    for (const p of lm) {
      ctx.beginPath();
      ctx.arc(px(p), py(p), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const grabPhoto = (video: HTMLVideoElement): string | null => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return null;
    if (!photoCanvasRef.current) photoCanvasRef.current = document.createElement('canvas');
    const canvas = photoCanvasRef.current;
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
    matchSumRef.current = 0;
    matchCountRef.current = 0;
    presentCountRef.current = 0;
    frameCountRef.current = 0;
    bestMatchRef.current = -1;
    bestPhotoRef.current = null;
    scoringRef.current = true;
  }, []);

  const finishHold = useCallback((): HoldResult => {
    scoringRef.current = false;
    const samples = matchCountRef.current;
    const score = samples > 0 ? Math.round(matchSumRef.current / samples) : 0;
    const covered = frameCountRef.current === 0 || presentCountRef.current < frameCountRef.current * 0.2;
    // Snap the final held pose (the frame at the moment the countdown ends), falling
    // back to the best-matching mid-hold frame only if the live frame isn't available.
    const photo = (videoRef.current ? grabPhoto(videoRef.current) : null) ?? bestPhotoRef.current;
    return { score, photo, samples, covered };
  }, []);

  useEffect(
    () => () => {
      stopCamera();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    },
    [stopCamera],
  );

  return { videoRef, overlayRef, status, startCamera, stopCamera, startHold, finishHold, setPose, setOverlayMode };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
