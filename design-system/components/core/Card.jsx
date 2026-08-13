import React from 'react';

export function Card({ children, padding = 'var(--card-padding)', style = {} }) {
  return (
    <div style={{
      boxSizing: 'border-box',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-l)',
      boxShadow: 'var(--shadow-card)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}
