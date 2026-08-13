import * as React from 'react';

export interface PillButtonProps {
  /** Button text, rendered uppercase */
  label: string;
  onClick?: () => void;
  /** primary = solid black pill; ghost = outlined, ink text */
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  /** Buttons are full-width at the bottom of a card by default */
  fullWidth?: boolean;
  icon?: React.ReactNode;
}
export declare function PillButton(props: PillButtonProps): JSX.Element;
