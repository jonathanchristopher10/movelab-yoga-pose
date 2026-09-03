import { useEffect, useRef, useState } from 'react';
import { Stage } from './components/Stage';
import { Landing, LandingBackdrop } from './screens/Landing';
import { HowToPlay } from './screens/HowToPlay';
import { ChoosePose } from './screens/ChoosePose';
import { Capture } from './screens/Capture';
import { Score } from './screens/Score';
import { usePoseCapture } from './lib/usePoseCapture';
import { useIdleReset } from './lib/useIdleReset';
import { scoreFromMotion } from './lib/score';
import { enterKiosk } from './lib/kiosk';
import { POSES, type Pose } from './lib/poses';

/** Dev-only harness for tuning the Capture reference card: open
 *  `http://localhost:5173/?preview=capture` (add `&pose=warrior|chair` and
 *  `&phase=prep|hold`). Renders the Capture screen frozen and camera-free so the
 *  card size/placement in Capture.tsx can be adjusted with live hot-reload. */
function useCapturePreview(): { pose: Pose; phase: Phase } | null {
  if (!import.meta.env.DEV) return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('preview') !== 'capture') return null;
  const pose = POSES.find((p) => p.id === params.get('pose')) ?? POSES[0];
  const phase: Phase = params.get('phase') === 'prep' ? 'prep' : 'hold';
  return { pose, phase };
}

type Screen = 'landing' | 'howToPlay' | 'choosePose' | 'capture' | 'score';
type Phase = 'prep' | 'hold';

const PREP_SECONDS = 3;
const HOLD_SECONDS = 8;
const SCORE_AUTORESET_MS = 12000;
const IDLE_RESET_MS = 45000;

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [pose, setPose] = useState<Pose | null>(null);
  const [phase, setPhase] = useState<Phase>('prep');
  const [seconds, setSeconds] = useState(PREP_SECONDS);
  const [score, setScore] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const attemptRef = useRef(0);

  const { videoRef, status: cameraStatus, startCamera, stopCamera, startHold, finishHold } = usePoseCapture();
  const previewPose = useCapturePreview();

  const goLanding = () => {
    setScreen('landing');
    setPose(null);
    setPhoto(null);
    setScore(0);
  };

  // Idle guard on every screen except the landing (which is the reset target).
  useIdleReset(goLanding, IDLE_RESET_MS, screen, screen !== 'landing');

  const startCapture = (p: Pose) => {
    attemptRef.current = 0;
    setPose(p);
    setPhase('prep');
    setSeconds(PREP_SECONDS);
    setScreen('capture');
  };

  // Camera lifecycle: on while capturing, off otherwise (frees the webcam + privacy).
  useEffect(() => {
    if (screen === 'capture') startCamera();
    else stopCamera();
  }, [screen, startCamera, stopCamera]);

  // Capture timeline: prep countdown → hold countdown → score.
  // The camera is required — the timeline only advances once it is granted.
  useEffect(() => {
    if (screen !== 'capture') return;
    if (cameraStatus !== 'ready') return; // wait for camera access; no bypass

    if (phase === 'prep') {
      if (seconds <= 0) {
        setPhase('hold');
        setSeconds(HOLD_SECONDS);
        startHold();
        return;
      }
      const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }

    // phase === 'hold'
    if (seconds <= 0) {
      const result = finishHold();
      // If the lens looked covered/empty, give one clean retry rather than a bogus score.
      if (result.covered && attemptRef.current < 1) {
        attemptRef.current += 1;
        setPhase('prep');
        setSeconds(PREP_SECONDS);
        return;
      }
      setScore(scoreFromMotion(result.motion));
      setPhoto(result.photo);
      setScreen('score');
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, phase, seconds, cameraStatus, startHold, finishHold]);

  // Auto-return to landing a few seconds after the score is shown.
  useEffect(() => {
    if (screen !== 'score') return;
    const t = setTimeout(goLanding, SCORE_AUTORESET_MS);
    return () => clearTimeout(t);
  }, [screen]);

  // Dev-only: render the Capture screen in isolation (frozen, no countdown) for
  // tuning the pose outline. See useCapturePreview above for the URL.
  if (previewPose) {
    return (
      <Stage backdrop={<div style={{ position: 'absolute', inset: 0, background: 'var(--ink)' }} />}>
        <Capture
          pose={previewPose.pose}
          phase={previewPose.phase}
          seconds={previewPose.phase === 'prep' ? 3 : 8}
          videoRef={videoRef}
          cameraStatus="ready"
          onRetryCamera={() => {}}
          hideCountdown
        />
      </Stage>
    );
  }

  // Full-bleed backdrop behind the canvas for image/camera screens, so their
  // background fills the screen instead of being boxed by letterbox bars.
  const backdrop =
    screen === 'landing' ? (
      <LandingBackdrop />
    ) : screen === 'capture' ? (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)' }} />
    ) : undefined;

  return (
    <Stage backdrop={backdrop}>
      {screen === 'landing' && (
        <Landing
          onStart={() => {
            void enterKiosk();
            setScreen('howToPlay');
          }}
        />
      )}
      {screen === 'howToPlay' && <HowToPlay onNext={() => setScreen('choosePose')} />}
      {screen === 'choosePose' && <ChoosePose onStart={startCapture} />}
      {screen === 'capture' && pose && (
        <Capture
          pose={pose}
          phase={phase}
          seconds={seconds}
          videoRef={videoRef}
          cameraStatus={cameraStatus}
          onRetryCamera={startCamera}
        />
      )}
      {screen === 'score' && pose && <Score score={score} photo={photo} />}
    </Stage>
  );
}
