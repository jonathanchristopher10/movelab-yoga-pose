import { useEffect, useRef } from 'react';

/**
 * Calls `onIdle` after `ms` of no pointer/key activity. Restarts whenever
 * `resetKey` changes (e.g. on every screen transition) so each screen gets a
 * fresh idle window. Disabled when `enabled` is false (e.g. on the landing
 * screen, which is already the reset target).
 */
export function useIdleReset(onIdle: () => void, ms: number, resetKey: unknown, enabled = true) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;
    let timer = window.setTimeout(() => onIdleRef.current(), ms);
    const bump = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => onIdleRef.current(), ms);
    };
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [ms, resetKey, enabled]);
}
