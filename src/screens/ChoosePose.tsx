import { useState } from 'react';
import { PoseCard } from '../components/PoseCard';
import { PillButton } from '../components/PillButton';
import { POSES, type Pose } from '../lib/poses';

export function ChoosePose({ onStart }: { onStart: (pose: Pose) => void }) {
  const [selected, setSelected] = useState<Pose>(POSES[0]);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '46px 30px 36px', background: 'var(--bg-warm)' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 42,
          lineHeight: 1.05,
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          textAlign: 'center',
        }}
      >
        Choose
        <br />
        Your Pose
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        {POSES.map((p) => (
          <PoseCard
            key={p.id}
            name={p.name}
            difficulty={p.difficulty}
            thumbnail={p.card}
            selected={selected.id === p.id}
            onClick={() => setSelected(p)}
          />
        ))}
      </div>
      <PillButton label="Next" onClick={() => onStart(selected)} />
    </div>
  );
}
