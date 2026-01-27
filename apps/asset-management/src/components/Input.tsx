import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            h-9 px-3 rounded-[var(--radius-md)]
            bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]
            border border-[var(--color-border-subtle)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]
            transition-colors duration-150
            ${error ? 'border-[var(--color-error)]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            px-3 py-2 rounded-[var(--radius-md)] min-h-[80px] resize-y
            bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]
            border border-[var(--color-border-subtle)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]
            transition-colors duration-150
            ${error ? 'border-[var(--color-error)]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
