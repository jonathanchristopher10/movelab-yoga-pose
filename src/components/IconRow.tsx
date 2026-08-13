import type { ReactNode } from 'react';

interface IconRowProps {
  icon: string;
  title: ReactNode;
  index?: number;
}

export function IconRow({ icon, title, index }: IconRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <img src={icon} alt="" style={{ width: 78, height: 78, objectFit: 'contain', transform: 'scale(3.4)' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.35 }}>
        {typeof index === 'number' && (
          <span style={{ color: 'var(--text-secondary)', marginRight: 6 }}>{index}.</span>
        )}
        {title}
      </div>
    </div>
  );
}
