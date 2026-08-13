import { IconRow } from '../components/IconRow';
import { PillButton } from '../components/PillButton';

export function HowToPlay({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '52px 34px 36px', background: 'var(--bg-warm)' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 44,
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          textAlign: 'center',
        }}
      >
        How to Play
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34 }}>
        <IconRow icon="/assets/icon-pose.png" title="Choose your pose" />
        <IconRow
          icon="/assets/icon-time.png"
          title={
            <>
              Hold the pose
              <br />
              for 8 seconds
            </>
          }
        />
        <IconRow
          icon="/assets/icon-trophy.png"
          title={
            <>
              Get your score
              <br />
              and get free merchandise
            </>
          }
        />
      </div>
      <PillButton label="Next" onClick={onNext} />
    </div>
  );
}
