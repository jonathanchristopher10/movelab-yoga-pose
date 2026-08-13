import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: string;
  style?: CSSProperties;
}

export function Card({ children, padding = 'var(--card-padding)', style = {} }: CardProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-l)',
        boxShadow: 'var(--shadow-card)',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
