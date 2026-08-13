import React from 'react';

export function PhotoFrame({ photo, score, logo = '../../assets/movelab-wordmark.png', poseName }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 4,
      overflow: 'hidden', background: 'var(--ink)',
    }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />}
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={logo} alt="MoveLab" style={{ height: 22, filter: 'invert(1)' }} />
        <div style={{
          width: 62, height: 62, borderRadius: '50%', border: '3px solid var(--accent-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: '#fff',
        }}>{score}</div>
      </div>
    </div>
  );
}
