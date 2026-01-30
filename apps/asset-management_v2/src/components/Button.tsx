import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'secondary', size = 'md', children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium
      rounded-[var(--radius-md)] transition-all duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]
    `;

    const variantStyles = {
      primary: `
        bg-[var(--color-accent-primary)] text-white
        hover:bg-[var(--color-accent-hover)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]
        border border-[var(--color-border-subtle)]
        hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-default)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--color-text-secondary)]
        hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
        active:scale-[0.98]
      `,
      danger: `
        bg-[var(--color-error)] text-white
        hover:bg-[var(--color-error)]/90
        active:scale-[0.98]
      `,
    };

    const sizeStyles = {
      sm: 'h-7 px-2.5 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
