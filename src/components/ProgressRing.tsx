import { useEffect, useState } from 'react';

interface ProgressRingProps {
  value?: number;
  size?: number;
  label?: string;
  animate?: boolean;
}

export function ProgressRing({ value = 0, size = 200, label = 'SCORE', animate = true }: ProgressRingProps) {
  const [display, setDisplay] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let start = 0;
    const duration = 900;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);

  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - display / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--score-track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: animate ? 'none' : 'stroke-dashoffset 480ms var(--ease-standard)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ fontSize: size * 0.24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{display}%</div>
        <div style={{ fontSize: 12, letterSpacing: 'var(--tracking-label)', color: 'var(--text-secondary)', marginTop: 4 }}>
          {label}
        </div>
      </div>
    </div>
  );
}
