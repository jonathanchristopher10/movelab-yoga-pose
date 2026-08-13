import type { Difficulty } from '../lib/poses';

interface PoseCardProps {
  name: string;
  difficulty: Difficulty;
  thumbnail: string;
  onClick?: () => void;
  selected?: boolean;
}

export function PoseCard({ name, difficulty, thumbnail, onClick, selected = false }: PoseCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        height: 135,
        textAlign: 'left',
        padding: '10px 16px',
        background: 'var(--panel-grey)',
        border: selected ? '2px solid var(--ink)' : '2px solid transparent',
        borderRadius: 'var(--radius-s)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        transition:
          'transform var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
      }}
      onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ width: 118, height: 132, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={thumbnail} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            letterSpacing: 'var(--tracking-display)',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink)', marginTop: 4 }}>({difficulty})</div>
      </div>
    </button>
  );
}
