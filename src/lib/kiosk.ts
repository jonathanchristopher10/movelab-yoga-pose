/**
 * Best-effort kiosk helpers. All of these fail silently on browsers/hardware
 * that don't support them — the booth still works, it's just less locked-down.
 */

let wakeLock: WakeLockSentinel | null = null;

/** True when the app is embedded in an iframe (e.g. a dev preview) rather than
 *  running as the top-level booth window. Fullscreen requests hang in that case. */
function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true; // cross-origin frame — treat as embedded
  }
}

/** Enter kiosk mode on first interaction. Fullscreen is intentionally NOT requested
 *  here for now (per product decision); keep the screen awake instead. */
export async function enterKiosk(): Promise<void> {
  document.documentElement.classList.add('kiosk');
  void requestWakeLock();
}

/** Keep the screen awake during a session (re-acquired after tab visibility changes). */
export async function requestWakeLock(): Promise<void> {
  if (isEmbedded()) return; // wake lock is disallowed / can hang inside a dev-preview iframe
  try {
    if (wakeLock) {
      await wakeLock.release().catch(() => {});
      wakeLock = null;
    }
    wakeLock = (await navigator.wakeLock?.request?.('screen')) ?? null;
  } catch {
    /* not supported / not allowed — ignore */
  }
}

export function initKiosk(): void {
  // Re-acquire the wake lock when the page becomes visible again.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && document.documentElement.classList.contains('kiosk')) {
      requestWakeLock();
    }
  });
  // Suppress the right-click / long-press context menu on the booth.
  window.addEventListener('contextmenu', (e) => e.preventDefault());
}
