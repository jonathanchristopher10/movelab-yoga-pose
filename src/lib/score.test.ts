import { describe, it, expect } from 'vitest';
import { scoreFromMotion, SCORE_FLOOR, SCORE_CEIL, MOTION_NOISE_FLOOR } from './score';

describe('scoreFromMotion', () => {
  it('gives a near-perfect score when perfectly still (zero motion)', () => {
    expect(scoreFromMotion(0)).toBe(SCORE_CEIL);
  });

  it('ignores motion at or below the noise floor', () => {
    expect(scoreFromMotion(MOTION_NOISE_FLOOR)).toBe(SCORE_CEIL);
  });

  it('clamps to the floor for large motion (never discouraging)', () => {
    expect(scoreFromMotion(1)).toBe(SCORE_FLOOR);
  });

  it('is monotonic: more motion never scores higher', () => {
    let prev = Infinity;
    for (let m = 0; m <= 0.3; m += 0.01) {
      const s = scoreFromMotion(m);
      expect(s).toBeLessThanOrEqual(prev);
      prev = s;
    }
  });

  it('stays within [floor, ceil] across the input range', () => {
    for (let m = -0.1; m <= 2; m += 0.05) {
      const s = scoreFromMotion(m);
      expect(s).toBeGreaterThanOrEqual(SCORE_FLOOR);
      expect(s).toBeLessThanOrEqual(SCORE_CEIL);
    }
  });

  it('a small wobble lands between floor and ceil', () => {
    const s = scoreFromMotion(0.04);
    expect(s).toBeGreaterThan(SCORE_FLOOR);
    expect(s).toBeLessThan(SCORE_CEIL);
  });
});
