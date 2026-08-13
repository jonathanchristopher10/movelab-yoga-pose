import { useEffect, useRef, useState } from 'react';
import { Stage } from './components/Stage';
import { Landing } from './screens/Landing';
import { HowToPlay } from './screens/HowToPlay';
import { ChoosePose } from './screens/ChoosePose';
import { Capture } from './screens/Capture';
import { Score } from './screens/Score';
import { usePoseCapture } from './lib/usePoseCapture';
import { useIdleReset } from './lib/useIdleReset';
import { scoreFromMotion } from './lib/score';
import { enterKiosk } from './lib/kiosk';
import type { Pose } from './lib/poses';

type Screen = 'landing' | 'howToPlay' | 'choosePose' | 'capture' | 'score';
type Phase = 'prep' | 'hold';

const PREP_SECONDS = 3;
const HOLD_SECONDS = 8;
const SCORE_AUTORESET_MS = 12000;
const IDLE_RESET_MS = 45000;

/** Feel-good fallback used when the customer opts to play without a camera. */
function simulatedScore(): number {
  return Math.round(90 + Math.random() * 8);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [pose, setPose] = useState<Pose | null>(null);
  const [phase, setPhase] = useState<Phase>('prep');
  const [seconds, setSeconds] = useState(PREP_SECONDS);
  const [score, setScore] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const attemptRef = useRef(0);

  const { videoRef, status: cameraStatus, startCamera, stopCamera, startHold, finishHold } = usePoseCapture();

  const goLanding = () => {
    setScreen('landing');
    setPose(null);
    setPhoto(null);
    setScore(0);
    setSimulated(false);
  };

  // Idle guard on every screen except the landing (which is the reset target).
  useIdleReset(goLanding, IDLE_RESET_MS, screen, screen !== 'landing');

  const startCapture = (p: Pose) => {
    attemptRef.current = 0;
    setSimulated(false);
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
  useEffect(() => {
    if (screen !== 'capture') return;
    const ready = cameraStatus === 'ready' || simulated;
    if (!ready) return; // wait for the camera (or a "continue without camera" choice)

    if (phase === 'prep') {
      if (seconds <= 0) {
        setPhase('hold');
        setSeconds(HOLD_SECONDS);
        if (!simulated) startHold();
        return;
      }
      const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }

    // phase === 'hold'
    if (seconds <= 0) {
      if (simulated) {
        setScore(simulatedScore());
        setPhoto(null);
        setScreen('score');
        return;
      }
      const result = finishHold();
      // If the lens looked covered/empty, give one clean retry rather than a bogus score.
      if (result.covered && attemptRef.current < 1) {
        attemptRef.current += 1;
        setPhase('prep');
        setSeconds(PREP_SECONDS);
        return;
      }
      setScore(result.covered ? simulatedScore() : scoreFromMotion(result.motion));
      setPhoto(result.photo);
      setScreen('score');
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, phase, seconds, cameraStatus, simulated, startHold, finishHold]);

  // Auto-return to landing a few seconds after the score is shown.
  useEffect(() => {
    if (screen !== 'score') return;
    const t = setTimeout(goLanding, SCORE_AUTORESET_MS);
    return () => clearTimeout(t);
  }, [screen]);

  return (
    <Stage>
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
          simulated={simulated}
          onRetryCamera={startCamera}
          onSkipCamera={() => setSimulated(true)}
        />
      )}
      {screen === 'score' && pose && <Score pose={pose} score={score} photo={photo} />}
    </Stage>
  );
}
