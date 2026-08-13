import * as React from 'react';

export interface IconRowProps {
  /** Path to a hand-drawn line icon, e.g. assets/icon-pose.png */
  icon: string;
  title: string;
  /** Optional leading number */
  index?: number;
}
export declare function IconRow(props: IconRowProps): JSX.Element;
