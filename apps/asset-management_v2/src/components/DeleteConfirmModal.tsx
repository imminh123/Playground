import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Asset, ExperienceInventory } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | ExperienceInventory | null;
}

export function DeleteConfirmModal({ isOpen, onClose, asset }: DeleteConfirmModalProps) {
  const { deleteAsset, deleteExperienceInventory, assets } = useStore();

  if (!asset) return null;

  const isFolder = asset.type === 'folder';
  const childCount = isFolder
    ? assets.filter((a) => a.parentId === asset.id).length
    : 0;

  const handleDelete = () => {
    if (asset.type === 'experience-inventory') {
      deleteExperienceInventory(asset.id);
    } else {
      deleteAsset(asset.id);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Asset" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-error-muted)] flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-[var(--color-error)]" />
          </div>
          <div>
            <p className="text-[var(--color-text-primary)]">
              Are you sure you want to delete <strong>"{asset.name}"</strong>?
            </p>
            {isFolder && childCount > 0 && (
              <p className="mt-2 text-sm text-[var(--color-warning)]">
                This folder contains {childCount} item{childCount > 1 ? 's' : ''} that will also be deleted.
              </p>
            )}
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
