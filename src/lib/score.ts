/**
 * Stability-only scoring (MVP).
 *
 * The Capture screen samples the camera during the 8-second hold and produces a
 * `motion` value per sample: the mean absolute luma difference between two
 * consecutive downscaled frames, normalized to [0, 1] (0 = identical frames,
 * higher = more movement). Averaging those samples gives how still the person
 * held. This maps that average to a feel-good score.
 *
 * The constants below are deliberately gentle and are meant to be calibrated on
 * the real booth hardware — camera noise, lighting, and lens all shift the
 * baseline. Kept as a pure function so it is trivial to unit-test and tune.
 */

export const SCORE_FLOOR = 85;
export const SCORE_CEIL = 99;

/** Camera sensor noise registers as tiny motion even when nothing moves; ignore below this. */
export const MOTION_NOISE_FLOOR = 0.012;

/** Multiplier turning "average motion above the noise floor" into points lost. Tune on device. */
export const MOTION_PENALTY = 260;

export interface StabilityScoreOptions {
  floor?: number;
  ceil?: number;
  noiseFloor?: number;
  penalty?: number;
}

/**
 * Map an average per-frame motion value (0..1) to a score in [floor, ceil].
 * Very still → near ceil; wobbly → toward floor. Always clamped so the booth
 * never shows a discouraging number.
 */
export function scoreFromMotion(avgMotion: number, opts: StabilityScoreOptions = {}): number {
  const floor = opts.floor ?? SCORE_FLOOR;
  const ceil = opts.ceil ?? SCORE_CEIL;
  const noiseFloor = opts.noiseFloor ?? MOTION_NOISE_FLOOR;
  const penalty = opts.penalty ?? MOTION_PENALTY;

  const effective = Math.max(0, avgMotion - noiseFloor);
  const raw = ceil - effective * penalty;
  return Math.round(clamp(raw, floor, ceil));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
