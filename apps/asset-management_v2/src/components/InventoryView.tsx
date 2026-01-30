import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { useStore } from '../store/useStore';
import type { SchemaColumn } from '../types';

interface EntryFormProps {
  schema: SchemaColumn[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  submitLabel: string;
}

function EntryForm({ schema, initialData, onSubmit, onCancel, submitLabel }: EntryFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    initialData ||
      schema.reduce((acc, col) => {
        acc[col.id] = '';
        return acc;
      }, {} as Record<string, unknown>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    schema.forEach((col) => {
      if (col.required && !formData[col.id]) {
        newErrors[col.id] = `${col.name} is required`;
      }
      if (col.type === 'email' && formData[col.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[col.id] as string)) {
          newErrors[col.id] = 'Invalid email address';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (column: SchemaColumn) => {
    switch (column.type) {
      case 'select':
        return (
          <Select
            value={(formData[column.id] as string) || ''}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, [column.id]: value }))
            }
            options={
              column.options?.map((opt) => ({ value: opt, label: opt })) || []
            }
            placeholder={`Select ${column.name}`}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={(formData[column.id] as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [column.id]: e.target.value }))
            }
            error={errors[column.id]}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={(formData[column.id] as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [column.id]: e.target.value }))
            }
            placeholder={`Enter ${column.name}`}
            error={errors[column.id]}
          />
        );
      default:
        return (
          <Input
            type={column.type === 'email' ? 'email' : 'text'}
            value={(formData[column.id] as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [column.id]: e.target.value }))
            }
            placeholder={`Enter ${column.name}`}
            error={errors[column.id]}
          />
        );
    }
  };

  return (
    <div className="space-y-4 p-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
      <div className="grid grid-cols-2 gap-4">
        {schema.map((column) => (
          <div key={column.id} className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              {column.name}
              {column.required && (
                <span className="text-[var(--color-error)] ml-1">*</span>
              )}
            </label>
            {renderField(column)}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export function InventoryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { experienceInventories, addInventoryEntry, updateInventoryEntry, deleteInventoryEntry } = useStore();

  const inventory = experienceInventories.find((inv) => inv.id === id);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!inventory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)]">Inventory not found</p>
          <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft size={16} />
            Back to Assets
          </Button>
        </div>
      </div>
    );
  }

  const handleAddEntry = (data: Record<string, unknown>) => {
    addInventoryEntry(inventory.id, data);
    setShowAddForm(false);
  };

  const handleUpdateEntry = (entryId: string, data: Record<string, unknown>) => {
    updateInventoryEntry(inventory.id, entryId, data);
    setEditingEntryId(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteInventoryEntry(inventory.id, entryId);
    setDeleteConfirmId(null);
  };

  const formatCellValue = (value: unknown, column: SchemaColumn): string => {
    if (value === undefined || value === null || value === '') return '—';

    if (column.type === 'date' && typeof value === 'string') {
      try {
        return format(new Date(value), 'MMM d, yyyy');
      } catch {
        return value;
      }
    }

    return String(value);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {inventory.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {inventory.entries.length} entries
              </span>
            </div>
          </div>
          {!showAddForm && (
            <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
              <Plus size={16} />
              Add Entry
            </Button>
          )}
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <EntryForm
                schema={inventory.schema}
                onSubmit={handleAddEntry}
                onCancel={() => setShowAddForm(false)}
                submitLabel="Add Entry"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-[var(--color-bg-primary)] rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] overflow-hidden">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-[var(--color-bg-tertiary)]">
                {inventory.schema.map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider"
                  >
                    {column.name}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.entries.map((entry, index) => {
                const entryId = (entry as { id: string }).id;
                const isEditing = editingEntryId === entryId;
                const isDeleting = deleteConfirmId === entryId;

                if (isEditing) {
                  return (
                    <tr key={entryId}>
                      <td
                        colSpan={inventory.schema.length + 1}
                        className="p-3 bg-[var(--color-bg-secondary)]"
                      >
                        <EntryForm
                          schema={inventory.schema}
                          initialData={entry as Record<string, unknown>}
                          onSubmit={(data) => handleUpdateEntry(entryId, data)}
                          onCancel={() => setEditingEntryId(null)}
                          submitLabel="Save Changes"
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <motion.tr
                    key={entryId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      border-t border-[var(--color-border-subtle)]
                      ${isDeleting ? 'bg-[var(--color-error-muted)]' : 'hover:bg-[var(--color-bg-hover)]'}
                      transition-colors
                    `}
                  >
                    {inventory.schema.map((column) => (
                      <td
                        key={column.id}
                        className="px-4 py-3 text-sm text-[var(--color-text-primary)]"
                      >
                        {formatCellValue(
                          (entry as Record<string, unknown>)[column.id],
                          column
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      {isDeleting ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteEntry(entryId)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingEntryId(entryId)}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(entryId)}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-muted)] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {inventory.entries.length === 0 && (
            <div className="px-4 py-16 text-center">
              <p className="text-[var(--color-text-secondary)]">No entries yet</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Add your first entry to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
