import React, { useEffect, useState } from 'react';

export function Countdown({ mode = 'number', value, total = 8, caption = '' }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => { setDisplay(value); }, [value]);

  if (mode === 'bar') {
    const pct = Math.max(0, Math.min(100, (value / total) * 100));
    return (
      <div style={{ width: '100%', fontFamily: 'var(--font-body)' }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: 'var(--accent)', transition: 'width 900ms linear' }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-on-dark-muted)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>{caption || `${value} sec remaining`}</div>
      </div>
    );
  }
  return (
    <div key={display} style={{
      fontFamily: 'var(--font-display)',
      fontSize: 96,
      color: 'var(--white)',
      textAlign: 'center',
      animation: 'moveLabCountdownPop var(--duration-standard) var(--ease-bounce)',
    }}>
      <style>{`@keyframes moveLabCountdownPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}`}</style>
      {display}
      {caption && <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, marginTop: 8, color: 'var(--text-on-dark-muted)', textTransform: 'none', letterSpacing: 0 }}>{caption}</div>}
    </div>
  );
}
