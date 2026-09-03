import { useLayoutEffect, useState, type ReactNode } from 'react';

/** Logical portrait canvas the whole booth is designed against. Everything inside
 *  uses the design system's fixed px values; the Stage scales this canvas to fit
 *  whatever display it runs on — a phone, a tablet, a laptop, or a portrait
 *  signage panel — so the layout never reflows, it just scales.
 *
 *  `backdrop` (optional) renders full-viewport BEHIND the canvas. Screens whose
 *  background is meant to bleed edge-to-edge (the Landing photo, the Capture
 *  camera view) pass a backdrop so the letterbox area is filled by that same
 *  visual instead of a flat bar. Flat screens pass none and paint their own
 *  --bg-warm inside the canvas, which matches the body background seamlessly. */
export const CANVAS_W = 420;
export const CANVAS_H = 860;

export function Stage({ children, backdrop }: { children: ReactNode; backdrop?: ReactNode }) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const compute = () => {
      // `contain`: fill the display while preserving the portrait aspect ratio.
      setScale(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H));
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  const fillsViewport =
    Math.abs(CANVAS_W * scale - window.innerWidth) < 2 || Math.abs(CANVAS_H * scale - window.innerHeight) < 2;

  const hasBackdrop = Boolean(backdrop);
  // The rounded "phone card" frame is only for flat screens on displays larger
  // than the canvas. Full-bleed screens (photo/camera) never get a frame.
  const showFrame = !hasBackdrop && !fillsViewport;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {hasBackdrop && <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>{backdrop}</div>}
      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          // Transparent so a full-bleed backdrop shows through the canvas region too;
          // flat screens paint their own --bg-warm inside and stay opaque.
          background: 'transparent',
          borderRadius: showFrame ? 36 : 0,
          border: showFrame ? '8px solid var(--ink)' : 'none',
          boxShadow: showFrame ? 'var(--shadow-float)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
