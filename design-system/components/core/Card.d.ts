import * as React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  /** CSS padding shorthand; defaults to the --card-padding token */
  padding?: string;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
