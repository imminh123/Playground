import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { TagInput } from './TagInput';
import { useStore } from '../store/useStore';
import type { SchemaColumn } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CreateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLUMN_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'select', label: 'Select' },
];

export function CreateInventoryModal({ isOpen, onClose }: CreateInventoryModalProps) {
  const { addExperienceInventory, currentFolderId } = useStore();
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [columns, setColumns] = useState<SchemaColumn[]>([
    { id: uuidv4(), name: '', type: 'text', required: false },
  ]);
  const [errors, setErrors] = useState<{ name?: string; columns?: string }>({});

  const addColumn = () => {
    setColumns([...columns, { id: uuidv4(), name: '', type: 'text', required: false }]);
  };

  const removeColumn = (id: string) => {
    if (columns.length > 1) {
      setColumns(columns.filter((col) => col.id !== id));
    }
  };

  const updateColumn = (id: string, updates: Partial<SchemaColumn>) => {
    setColumns(
      columns.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  };

  const handleCreate = () => {
    const newErrors: { name?: string; columns?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const validColumns = columns.filter((col) => col.name.trim() !== '');
    if (validColumns.length === 0) {
      newErrors.columns = 'At least one column is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addExperienceInventory({
      name: name.trim(),
      type: 'experience-inventory',
      tags: selectedTags,
      parentId: currentFolderId,
      schema: validColumns,
      entries: [],
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedTags([]);
    setColumns([{ id: uuidv4(), name: '', type: 'text', required: false }]);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Experience Inventory" size="lg">
      <div className="space-y-6">
        <Input
          label="Inventory Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="e.g., Customer Contacts, Project Tasks"
          error={errors.name}
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Tags (optional)
          </label>
          <TagInput
            selectedTagIds={selectedTags}
            onChange={setSelectedTags}
            placeholder="Add tags..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Schema Columns
            </label>
            <Button variant="ghost" size="sm" onClick={addColumn}>
              <Plus size={14} />
              Add Column
            </Button>
          </div>

          {errors.columns && (
            <p className="text-sm text-[var(--color-error)]">{errors.columns}</p>
          )}

          <div className="space-y-2">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className="flex items-center gap-2 p-3 bg-[var(--color-bg-elevated)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]"
              >
                <GripVertical
                  size={16}
                  className="text-[var(--color-text-muted)] cursor-grab flex-shrink-0"
                />
                <div className="flex-1 grid grid-cols-[1fr,120px,80px] gap-2">
                  <Input
                    value={column.name}
                    onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                    placeholder={`Column ${index + 1}`}
                  />
                  <Select
                    value={column.type}
                    onChange={(value) =>
                      updateColumn(column.id, {
                        type: value as SchemaColumn['type'],
                      })
                    }
                    options={COLUMN_TYPES}
                  />
                  <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={column.required || false}
                      onChange={(e) =>
                        updateColumn(column.id, { required: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]"
                    />
                    Required
                  </label>
                </div>
                <button
                  onClick={() => removeColumn(column.id)}
                  disabled={columns.length === 1}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {columns.some((col) => col.type === 'select') && (
            <div className="p-3 bg-[var(--color-info-muted)] rounded-[var(--radius-md)] border border-[var(--color-info)]/20">
              <p className="text-sm text-[var(--color-info)]">
                Select column options can be configured after creating the inventory.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create Inventory
          </Button>
        </div>
      </div>
    </Modal>
  );
}
