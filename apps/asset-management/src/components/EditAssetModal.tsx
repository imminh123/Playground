import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { TagInput } from './TagInput';
import { useStore } from '../store/useStore';
import type { Asset, ExperienceInventory } from '../types';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | ExperienceInventory | null;
}

export function EditAssetModal({ isOpen, onClose, asset }: EditAssetModalProps) {
  const { updateAsset, updateExperienceInventory, updateAssetTags } = useStore();
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setSelectedTags(asset.tags);
    }
  }, [asset]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!asset) return;

    if (asset.type === 'experience-inventory') {
      updateExperienceInventory(asset.id, { name: name.trim() });
    } else {
      updateAsset(asset.id, { name: name.trim() });
    }
    updateAssetTags(asset.id, selectedTags);

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedTags([]);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Asset" size="sm">
      <div className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Enter name"
          error={error}
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Tags
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
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
