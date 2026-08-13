import type { CSSProperties, ReactNode } from 'react';

interface PillButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function PillButton({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  icon = null,
}: PillButtonProps) {
  const isDark = variant === 'primary';
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth ? '100%' : 'auto',
    padding: '18px 28px',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    border: isDark ? 'none' : '1.5px solid var(--ink)',
    background: disabled ? 'var(--border-hairline)' : isDark ? 'var(--ink)' : 'transparent',
    color: disabled ? 'var(--text-secondary)' : isDark ? 'var(--white)' : 'var(--ink)',
    cursor: disabled ? 'default' : 'pointer',
    transition:
      'transform var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.6 : 1,
  };
  return (
    <button
      style={style}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onPointerDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
      {label}
    </button>
  );
}
