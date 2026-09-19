import type { OverlayMode } from '../lib/usePoseTracker';

/** Full-bleed Landing backdrop (studio photo + fade to the warm background).
 *  Rendered by the Stage across the whole viewport so it never looks "boxed in"
 *  by letterbox bars — the photo fills the screen on any phone/tablet/signage. */
export function LandingBackdrop() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <img
        src="/assets/background-landing.png"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg,rgba(227,226,222,0.10) 0%,rgba(227,226,222,0.72) 78%,rgba(227,226,222,0.96) 100%)',
        }}
      />
    </div>
  );
}

interface LandingProps {
  onStart: () => void;
  overlayMode: OverlayMode;
  onOverlayModeChange: (mode: OverlayMode) => void;
}

export function Landing({ onStart, overlayMode, onOverlayModeChange }: LandingProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', padding: '32px 28px 0', display: 'flex', justifyContent: 'center' }}>
        <img src="/assets/movelab-wordmark.png" alt="MoveLab" style={{ height: 32, width: 146 }} />
      </div>
      <div style={{ position: 'relative', marginTop: 'auto', padding: '0 28px 40px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 50,
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-display)',
            textTransform: 'uppercase',
            color: 'var(--ink)',
          }}
        >
          Balance
          <br />
          Challenge
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--body-l)', color: 'var(--text-secondary)', marginTop: 8, marginBottom: 30 }}>
          Find Your Balance.
        </div>
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '18px 28px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: 'var(--ink)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 'var(--tracking-label)',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Touch to Start
        </button>
        <OverlayToggle mode={overlayMode} onChange={onOverlayModeChange} />
      </div>
    </div>
  );
}

/** Small A/B toggle (test aid) to switch the live camera overlay style. */
function OverlayToggle({ mode, onChange }: { mode: OverlayMode; onChange: (m: OverlayMode) => void }) {
  const options: { id: OverlayMode; label: string }[] = [
    { id: 'outline', label: 'Outline' },
    { id: 'skeleton', label: 'Skeleton' },
  ];
  return (
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
        Camera overlay
      </div>
      <div
        style={{
          display: 'inline-flex',
          padding: 3,
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(17,17,17,0.06)',
          border: '1px solid var(--border-default)',
        }}
      >
        {options.map((o) => {
          const active = mode === o.id;
          return (
            <button
              key={o.id}
              onClick={(e) => {
                e.stopPropagation();
                onChange(o.id);
              }}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 'var(--tracking-label)',
                textTransform: 'uppercase',
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                transition: 'background var(--duration-fast) var(--ease-standard)',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
