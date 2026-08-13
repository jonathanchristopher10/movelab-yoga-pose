function Score({ pose, score, PhotoFrame }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 30px 32px', background: 'var(--bg-warm)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1.05, letterSpacing: '0.01em', textTransform: 'uppercase', color: 'var(--ink)' }}>Great<br />Balance!</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 19, color: 'var(--ink)', marginTop: 8, marginBottom: 22 }}>Amazing! You did it.</div>
      <div style={{ width: '100%' }}><PhotoFrame photo={pose.thumb} score={score} logo="../../assets/movelab-wordmark.png" /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 'auto', paddingTop: 24, width: '100%' }}>
        <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', textAlign: 'left', lineHeight: 1.4 }}>Please scan the QR code to download the photo.</div>
        <div style={{ width: 96, height: 96, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', flexShrink: 0 }}>QR</div>
      </div>
    </div>
  );
}
Object.assign(window, { Score });
