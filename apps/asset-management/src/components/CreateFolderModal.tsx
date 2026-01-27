import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { TagInput } from './TagInput';
import { useStore } from '../store/useStore';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const { addAsset, currentFolderId } = useStore();
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    addAsset({
      name: name.trim(),
      type: 'folder',
      tags: selectedTags,
      size: 0,
      parentId: currentFolderId,
    });

    setName('');
    setSelectedTags([]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedTags([]);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Folder" size="sm">
      <div className="space-y-4">
        <Input
          label="Folder Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Enter folder name"
          error={error}
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create Folder
          </Button>
        </div>
      </div>
    </Modal>
  );
}
