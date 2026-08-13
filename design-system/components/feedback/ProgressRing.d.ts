import * as React from 'react';

export interface ProgressRingProps {
  /** 0-100 */
  value: number;
  size?: number;
  label?: string;
  /** Animate the fill from 0 on mount */
  animate?: boolean;
}
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;
