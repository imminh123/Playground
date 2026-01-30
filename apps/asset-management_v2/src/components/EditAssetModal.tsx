import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { useStore } from '../store/useStore';
import type { Asset, ExperienceInventory } from '../types';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | ExperienceInventory | null;
}

export function EditAssetModal({ isOpen, onClose, asset }: EditAssetModalProps) {
  const { updateAsset, updateExperienceInventory } = useStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name);
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

    handleClose();
  };

  const handleClose = () => {
    setName('');
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
