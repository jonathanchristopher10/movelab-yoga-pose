export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Pose {
  id: 'tree' | 'warrior' | 'chair';
  name: string;
  difficulty: Difficulty;
  /** Full-bleed thumbnail (used on the Score photo fallback). */
  thumb: string;
  /** Trimmed cut-out used inside the PoseCard on Choose Pose. */
  card: string;
  /** Faint body outline overlaid on the live camera during Capture. */
  outline: string;
}

export const POSES: Pose[] = [
  {
    id: 'tree',
    name: 'Tree Pose',
    difficulty: 'Easy',
    thumb: '/assets/thumb-tree.png',
    card: '/assets/pose-tree.png',
    outline: '/assets/outline-tree.png',
  },
  {
    id: 'warrior',
    name: 'Warrior II',
    difficulty: 'Medium',
    thumb: '/assets/thumb-warrior.png',
    card: '/assets/pose-warrior.png',
    outline: '/assets/outline-warrior.png',
  },
  {
    id: 'chair',
    name: 'Chair Pose',
    difficulty: 'Hard',
    thumb: '/assets/thumb-chair.png',
    card: '/assets/pose-chair.png',
    outline: '/assets/outline-chair.png',
  },
];
