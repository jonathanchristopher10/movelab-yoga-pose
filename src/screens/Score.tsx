import { PhotoFrame } from '../components/PhotoFrame';
import type { Pose } from '../lib/poses';

interface ScoreProps {
  pose: Pose;
  score: number;
  /** Captured selfie (data URL). Falls back to the pose thumbnail if the camera was skipped. */
  photo: string | null;
}

export function Score({ pose, score, photo }: ScoreProps) {
  const hasPhoto = Boolean(photo);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 30px 32px',
        background: 'var(--bg-warm)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 42,
          lineHeight: 1.05,
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
        }}
      >
        Great
        <br />
        Balance!
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 19, color: 'var(--ink)', marginTop: 8, marginBottom: 22 }}>
        Amazing! You did it.
      </div>
      <div style={{ width: '100%' }}>
        <PhotoFrame photo={photo ?? pose.thumb} score={score} logo="/assets/movelab-wordmark.png" mirror={hasPhoto} />
      </div>
      {/* QR to download the captured photo. Placeholder until the (deferred) backend
          hosts the photo and returns a short URL to encode — see README backend seam. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 'auto', paddingTop: 24, width: '100%' }}>
        <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', textAlign: 'left', lineHeight: 1.4 }}>
          Please scan the QR code to download the photo.
        </div>
        <img
          src="/assets/qr-dummy.png"
          alt="QR code to download your photo"
          style={{ width: 96, height: 96, flexShrink: 0, display: 'block' }}
        />
      </div>
    </div>
  );
}
