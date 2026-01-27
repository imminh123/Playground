import { useState, useRef, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Tag as TagComponent } from './Tag';
import type { TagColor } from '../types';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

interface TagInputProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
}

const TAG_COLORS: TagColor[] = ['violet', 'blue', 'cyan', 'emerald', 'amber', 'rose', 'pink', 'orange'];

export function TagInput({ selectedTagIds, onChange, placeholder = 'Add tags...' }: TagInputProps) {
  const { tags, addTag } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const filteredTags = tags.filter(
    (tag) =>
      !selectedTagIds.includes(tag.id) &&
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const canCreateTag =
    inputValue.trim() !== '' &&
    !tags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [inputValue, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue === '' && selectedTagIds.length > 0) {
      onChange(selectedTagIds.slice(0, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (canCreateTag) {
        const randomColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
        const newTag = { name: inputValue.trim(), color: randomColor };
        addTag(newTag);
        const newTagObj = tags.find((t) => t.name === newTag.name) || { ...newTag, id: `tag-${Date.now()}` };
        onChange([...selectedTagIds, newTagObj.id]);
        setInputValue('');
      } else if (filteredTags.length > 0) {
        onChange([...selectedTagIds, filteredTags[highlightedIndex].id]);
        setInputValue('');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = canCreateTag ? filteredTags.length : filteredTags.length - 1;
      setHighlightedIndex((prev) => Math.min(prev + 1, maxIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleCreateTag = () => {
    if (canCreateTag) {
      const randomColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
      addTag({ name: inputValue.trim(), color: randomColor });
      setTimeout(() => {
        const newTag = useStore.getState().tags.find((t) => t.name === inputValue.trim());
        if (newTag) {
          onChange([...selectedTagIds, newTag.id]);
        }
        setInputValue('');
      }, 0);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`
          min-h-[42px] px-2 py-1.5 rounded-[var(--radius-md)]
          bg-[var(--color-bg-secondary)]
          border border-[var(--color-border-subtle)]
          flex flex-wrap items-center gap-1.5
          focus-within:border-[var(--color-accent-primary)] focus-within:ring-1 focus-within:ring-[var(--color-accent-primary)]
          transition-colors duration-150 cursor-text
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag) => (
          <TagComponent
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => onChange(selectedTagIds.filter((id) => id !== tag.id))}
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      <AnimatePresence>
        {isOpen && (filteredTags.length > 0 || canCreateTag) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-1 py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] max-h-[200px] overflow-y-auto"
          >
            {filteredTags.map((tag, index) => (
              <button
                key={tag.id}
                onClick={() => {
                  onChange([...selectedTagIds, tag.id]);
                  setInputValue('');
                }}
                className={`
                  w-full px-3 py-2 flex items-center gap-2 text-left text-sm
                  ${highlightedIndex === index ? 'bg-[var(--color-bg-hover)]' : ''}
                  hover:bg-[var(--color-bg-hover)] transition-colors
                `}
              >
                <TagComponent name={tag.name} color={tag.color} size="sm" />
              </button>
            ))}
            {canCreateTag && (
              <button
                onClick={handleCreateTag}
                className={`
                  w-full px-3 py-2 flex items-center gap-2 text-left text-sm text-[var(--color-text-secondary)]
                  ${highlightedIndex === filteredTags.length ? 'bg-[var(--color-bg-hover)]' : ''}
                  hover:bg-[var(--color-bg-hover)] transition-colors
                `}
              >
                <Plus size={14} className="text-[var(--color-accent-primary)]" />
                <span>Create "{inputValue}"</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TagMultiSelectProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
}

export function TagMultiSelect({ selectedTagIds, onChange, placeholder = 'Select tags...' }: TagMultiSelectProps) {
  const { tags } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-md)]
          bg-[var(--color-bg-secondary)]
          border border-[var(--color-border-subtle)]
          flex flex-wrap items-center gap-1.5 text-left
          hover:border-[var(--color-border-default)]
          focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]
          transition-colors duration-150
        `}
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <TagComponent key={tag.id} name={tag.name} color={tag.color} size="sm" />
          ))
        ) : (
          <span className="text-sm text-[var(--color-text-muted)]">{placeholder}</span>
        )}
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
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <TagComponent name={tag.name} color={tag.color} size="sm" />
                {selectedTagIds.includes(tag.id) && (
                  <Check size={14} className="text-[var(--color-accent-primary)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
