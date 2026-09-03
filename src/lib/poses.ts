export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Pose {
  id: 'tree' | 'warrior' | 'chair';
  name: string;
  difficulty: Difficulty;
  /** Full-bleed thumbnail (used on the Score photo fallback). */
  thumb: string;
  /** Trimmed cut-out used inside the PoseCard on Choose Pose. */
  card: string;
  /** Tightly-trimmed pose photo for the v2 Capture reference card (fills the card). */
  refPhoto: string;
  /** Faint body outline overlaid on the live camera during Capture. */
  outline: string;
  /** Optional horizontal nudge for the Capture outline (CSS length/%, e.g. '-6%').
   *  Asymmetric poses (a raised knee, etc.) are centered by their bounding box, so
   *  their visual center can sit off-screen-center — nudge to correct it. */
  outlineNudgeX?: string;
  /** Optional size multiplier for the Capture outline (default 1). Wide poses like
   *  Warrior II fit by width and render short, so scale them up to match the others. */
  outlineScale?: number;
}

export const POSES: Pose[] = [
  {
    id: 'tree',
    name: 'Tree Pose',
    difficulty: 'Easy',
    thumb: '/assets/thumb-tree.png',
    card: '/assets/pose-tree.png',
    refPhoto: '/assets/pose-tree-ref.png',
    outline: '/assets/outline-tree.png',
    outlineNudgeX: '-11%', // raised knee juts left; shift to center the standing figure
  },
  {
    id: 'warrior',
    name: 'Warrior II',
    difficulty: 'Medium',
    thumb: '/assets/thumb-warrior.png',
    card: '/assets/pose-warrior.png',
    refPhoto: '/assets/pose-warrior-ref.png',
    outline: '/assets/outline-warrior.png',
    outlineScale: 1.3, // wide pose fits by width and renders short; scale up to match
  },
  {
    id: 'chair',
    name: 'Chair Pose',
    difficulty: 'Hard',
    thumb: '/assets/thumb-chair.png',
    card: '/assets/pose-chair.png',
    refPhoto: '/assets/pose-chair-ref.png',
    outline: '/assets/outline-chair.png',
  },
];
