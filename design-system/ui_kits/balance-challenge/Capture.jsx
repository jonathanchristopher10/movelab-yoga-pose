function Capture({ pose, phase, seconds, Countdown }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}>
      <img src={pose.thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transform: 'scaleX(-1)', opacity: 0.7, filter: 'grayscale(0.2)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(17,17,17,0.75) 0%,rgba(17,17,17,0.25) 30%,rgba(17,17,17,0.25) 70%,rgba(17,17,17,0.85) 100%)' }} />
      <img src={pose.outline} alt="" style={{ position: 'absolute', inset: '12% 8% 12%', width: '84%', height: '76%', objectFit: 'contain', opacity: 0.9, margin: 'auto' }} />

      <div style={{ position: 'relative', padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: '#fff' }}>{pose.name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--body-m)', color: 'var(--text-on-dark-muted)', marginTop: 2 }}>Hold steady</div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24 }}>
        {phase === 'prep' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
            <Countdown mode="number" value={seconds} caption="Get ready" />
          </div>
        )}
        {phase === 'hold' && <Countdown mode="bar" value={seconds} total={8} />}
      </div>
    </div>
  );
}
Object.assign(window, { Capture });
