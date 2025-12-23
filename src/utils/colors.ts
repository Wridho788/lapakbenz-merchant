/**
 * LapakBenz Color Utility
 * Provides programmatic access to theme colors
 * Use Tailwind classes when possible, this for dynamic cases
 */

export const colors = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  background: 'var(--color-background)',
  
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    inverse: 'var(--color-text-inverse)',
    muted: 'var(--color-text-muted)',
  },
  
  surface: {
    white: 'var(--color-surface-white)',
    card: 'var(--color-surface-card)',
    hover: 'var(--color-surface-hover)',
  },
  
  border: {
    light: 'var(--color-border-light)',
    medium: 'var(--color-border-medium)',
    dark: 'var(--color-border-dark)',
  },
  
  status: {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  },
} as const;

export type ColorKey = keyof typeof colors;
