import type { CSSProperties, RefObject } from 'react';
import { Countdown } from '../components/Countdown';
import type { CameraStatus } from '../lib/usePoseCapture';
import type { Pose } from '../lib/poses';

interface CaptureProps {
  pose: Pose;
  phase: 'prep' | 'hold';
  seconds: number;
  videoRef: RefObject<HTMLVideoElement>;
  cameraStatus: CameraStatus;
  onRetryCamera: () => void;
  /** Dev-only: hide the countdown so the reference card can be sized/placed in isolation. */
  hideCountdown?: boolean;
}

// The reference card: big + centered while getting into position (prep), then it
// shrinks into the top corner during the hold so the live camera (the participant)
// is the focus. Both layouts are percentages of the portrait canvas; the card
// transitions smoothly between them.
const CARD_PREP: CSSProperties = { top: '15%', left: '16%', width: '68%', height: '62%' };
const CARD_HOLD: CSSProperties = { top: '5%', left: '69%', width: '27%', height: '23%' };

export function Capture({ pose, phase, seconds, videoRef, cameraStatus, onRetryCamera, hideCountdown = false }: CaptureProps) {
  const cameraLive = cameraStatus === 'ready' || cameraStatus === 'requesting';
  const cameraBlocked = cameraStatus === 'denied' || cameraStatus === 'error';
  const layout = phase === 'prep' ? CARD_PREP : CARD_HOLD;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}>
      {/* Live camera (mirrored for a selfie feel) — the participant is the focus. */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          opacity: cameraLive ? 1 : 0,
          transition: 'opacity var(--duration-slow) var(--ease-standard)',
        }}
      />
      {/* Light legibility scrim (top + bottom) for the header and countdown. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg,rgba(17,17,17,0.72) 0%,rgba(17,17,17,0.12) 22%,rgba(17,17,17,0.12) 74%,rgba(17,17,17,0.85) 100%)',
        }}
      />

      {/* Reference pose card — light so the black-activewear cutout stays clearly
          visible on signage against the dark camera view. */}
      <div
        style={{
          position: 'absolute',
          ...layout,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-l)',
          boxShadow: 'var(--shadow-float)',
          padding: 10,
          boxSizing: 'border-box',
          transition: 'top 600ms var(--ease-standard), left 600ms var(--ease-standard), width 600ms var(--ease-standard), height 600ms var(--ease-standard)',
          overflow: 'hidden',
        }}
      >
        <img src={pose.refPhoto} alt={pose.name} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
      </div>

      {/* Header. */}
      <div style={{ position: 'relative', padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: '#fff' }}>
          {pose.name}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--body-m)', color: 'var(--text-on-dark-muted)', marginTop: 2 }}>
          {phase === 'prep' ? 'Get into position' : 'Hold steady'}
        </div>
      </div>

      {/* Countdown. */}
      {!hideCountdown && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24 }}>
          {phase === 'prep' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
              <Countdown mode="number" value={seconds} caption="Get ready" />
            </div>
          )}
          {phase === 'hold' && <Countdown mode="bar" value={seconds} total={8} />}
        </div>
      )}

      {/* Camera permission / error overlay — camera is required to play. */}
      {cameraBlocked && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--surface-dark-glass)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,
            gap: 14,
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: '#fff' }}>
            Camera needed
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-on-dark-muted)', maxWidth: 280, lineHeight: 1.5 }}>
            {cameraStatus === 'denied'
              ? 'Camera access is required to play. Please allow the camera, then try again.'
              : 'We couldn’t reach the camera on this device. Please try again.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260, marginTop: 8 }}>
            <button
              onClick={onRetryCamera}
              style={{
                padding: '16px 24px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: '#fff',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 'var(--tracking-label)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
