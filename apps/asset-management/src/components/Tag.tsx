import { X } from 'lucide-react';
import type { TagColor } from '../types';

interface TagProps {
  name: string;
  color: TagColor;
  onRemove?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const colorStyles: Record<TagColor, { bg: string; text: string; border: string }> = {
  violet: {
    bg: 'bg-[var(--color-tag-violet-bg)]',
    text: 'text-[var(--color-tag-violet)]',
    border: 'border-[var(--color-tag-violet)]/20',
  },
  blue: {
    bg: 'bg-[var(--color-tag-blue-bg)]',
    text: 'text-[var(--color-tag-blue)]',
    border: 'border-[var(--color-tag-blue)]/20',
  },
  cyan: {
    bg: 'bg-[var(--color-tag-cyan-bg)]',
    text: 'text-[var(--color-tag-cyan)]',
    border: 'border-[var(--color-tag-cyan)]/20',
  },
  emerald: {
    bg: 'bg-[var(--color-tag-emerald-bg)]',
    text: 'text-[var(--color-tag-emerald)]',
    border: 'border-[var(--color-tag-emerald)]/20',
  },
  amber: {
    bg: 'bg-[var(--color-tag-amber-bg)]',
    text: 'text-[var(--color-tag-amber)]',
    border: 'border-[var(--color-tag-amber)]/20',
  },
  rose: {
    bg: 'bg-[var(--color-tag-rose-bg)]',
    text: 'text-[var(--color-tag-rose)]',
    border: 'border-[var(--color-tag-rose)]/20',
  },
  pink: {
    bg: 'bg-[var(--color-tag-pink-bg)]',
    text: 'text-[var(--color-tag-pink)]',
    border: 'border-[var(--color-tag-pink)]/20',
  },
  orange: {
    bg: 'bg-[var(--color-tag-orange-bg)]',
    text: 'text-[var(--color-tag-orange)]',
    border: 'border-[var(--color-tag-orange)]/20',
  },
};

export function Tag({ name, color, onRemove, onClick, size = 'sm' }: TagProps) {
  const styles = colorStyles[color];
  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md font-medium border
        ${styles.bg} ${styles.text} ${styles.border} ${sizeStyles}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
      onClick={onClick}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
