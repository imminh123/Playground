import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select...', label }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full h-9 px-3 rounded-[var(--radius-md)]
            bg-[var(--color-bg-secondary)]
            border border-[var(--color-border-subtle)]
            flex items-center justify-between gap-2
            text-sm text-left
            hover:border-[var(--color-border-default)]
            focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]
            transition-colors duration-150
          `}
        >
          <span className={selectedOption ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-[var(--color-text-tertiary)] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full left-0 right-0 mt-1 py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] max-h-[200px] overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 flex items-center justify-between gap-2
                    text-sm text-left
                    ${value === option.value ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-hover)]' : 'text-[var(--color-text-secondary)]'}
                    hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
                    transition-colors
                  `}
                >
                  {option.label}
                  {value === option.value && (
                    <Check size={14} className="text-[var(--color-accent-primary)]" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
