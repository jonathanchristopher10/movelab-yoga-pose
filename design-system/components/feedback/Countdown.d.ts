import * as React from 'react';

export interface CountdownProps {
  /** number = big scale-in digit (3s prep); bar = linear progress bar (8s hold) */
  mode?: 'number' | 'bar';
  /** current value: seconds remaining */
  value: number;
  /** bar mode only — total duration to compute fill % against */
  total?: number;
  caption?: string;
}
export declare function Countdown(props: CountdownProps): JSX.Element;
