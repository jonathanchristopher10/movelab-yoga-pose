import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

/** MediaPipe Pose landmark indices (the subset we compare). */
const IDX = {
  LSHO: 11, RSHO: 12,
  LELB: 13, RELB: 14,
  LWRI: 15, RWRI: 16,
  LHIP: 23, RHIP: 24,
  LKNE: 25, RKNE: 26,
  LANK: 27, RANK: 28,
} as const;

/** Joints compared as [a, vertex, c] triples — the angle at `vertex`. Using joint
 *  angles (not raw positions) makes the match independent of body size, distance
 *  from the camera, and where the person stands in frame. */
const JOINTS: ReadonlyArray<readonly [number, number, number]> = [
  [IDX.LELB, IDX.LSHO, IDX.LHIP], // left shoulder (armpit)
  [IDX.RELB, IDX.RSHO, IDX.RHIP], // right shoulder
  [IDX.LSHO, IDX.LELB, IDX.LWRI], // left elbow
  [IDX.RSHO, IDX.RELB, IDX.RWRI], // right elbow
  [IDX.LSHO, IDX.LHIP, IDX.LKNE], // left hip
  [IDX.RSHO, IDX.RHIP, IDX.RKNE], // right hip
  [IDX.LHIP, IDX.LKNE, IDX.LANK], // left knee
  [IDX.RHIP, IDX.RKNE, IDX.RANK], // right knee
];

/** Torso points that indicate a person is present. Deliberately NOT the knees:
 *  in side-on (Warrior) or bent (Chair) poses the knees have low confidence, which
 *  would falsely read as "no person" and trigger a retry. Shoulders + hips are
 *  reliably visible in every pose. */
const PRESENCE_KEYS = [IDX.LSHO, IDX.RSHO, IDX.LHIP, IDX.RHIP];

function angleAt(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const mag = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
  if (mag === 0) return NaN;
  const cos = Math.max(-1, Math.min(1, dot / mag));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** The 8-angle signature of a pose (degrees; NaN where a joint can't be computed). */
export function poseAngles(lm: NormalizedLandmark[]): number[] {
  return JOINTS.map(([a, b, c]) => (lm[a] && lm[b] && lm[c] ? angleAt(lm[a], lm[b], lm[c]) : NaN));
}

/** Are the key body points present and confident enough to score? */
export function landmarksPresent(lm: NormalizedLandmark[] | undefined, minVis = 0.3): boolean {
  if (!lm || lm.length < 29) return false;
  return PRESENCE_KEYS.every((i) => lm[i] && (lm[i].visibility === undefined || lm[i].visibility >= minVis));
}

/** Degrees of average joint difference that maps to a score of 0. Larger = more lenient. */
const TOLERANCE_DEG = 55;

/** Compare a live angle signature to the target pose's signature → 0..100. */
export function angleMatch(live: number[], target: number[]): number {
  let sum = 0;
  let n = 0;
  for (let i = 0; i < target.length; i++) {
    if (!Number.isNaN(live[i]) && !Number.isNaN(target[i])) {
      sum += Math.abs(live[i] - target[i]);
      n++;
    }
  }
  if (n === 0) return 0;
  const meanDiff = sum / n;
  return Math.max(0, Math.min(100, Math.round(100 - meanDiff * (100 / TOLERANCE_DEG))));
}
