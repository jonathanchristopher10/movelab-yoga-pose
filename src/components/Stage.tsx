import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Logical portrait canvas the whole booth is designed against. Everything inside
 *  uses the design system's fixed px values; the Stage scales this canvas to fit
 *  whatever display it runs on — a phone, a tablet, a laptop, or a portrait
 *  signage panel — so the layout never reflows, it just scales. */
export const CANVAS_W = 420;
export const CANVAS_H = 860;

export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // `contain`: fill the display while preserving the portrait aspect ratio.
      setScale(Math.min(vw / CANVAS_W, vh / CANVAS_H));
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  // When the scaled canvas fills the viewport almost exactly, drop the rounded
  // "phone" framing so it reads as a true full-screen kiosk rather than a device mock.
  const fillsViewport =
    Math.abs(CANVAS_W * scale - window.innerWidth) < 2 || Math.abs(CANVAS_H * scale - window.innerHeight) < 2;
  const nearlyFull = CANVAS_H * scale > window.innerHeight - 24;

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
      <div
        ref={frameRef}
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-warm)',
          borderRadius: fillsViewport ? 0 : 36,
          border: nearlyFull && fillsViewport ? 'none' : '8px solid var(--ink)',
          boxShadow: fillsViewport ? 'none' : 'var(--shadow-float)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
