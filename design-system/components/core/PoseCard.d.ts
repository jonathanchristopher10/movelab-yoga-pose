import * as React from 'react';

export interface PoseCardProps {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  /** Cutout pose photo, e.g. assets/thumb-tree.png */
  thumbnail: string;
  onClick?: () => void;
  selected?: boolean;
}
export declare function PoseCard(props: PoseCardProps): JSX.Element;
