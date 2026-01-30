import { useState, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Select } from './Select';
import { useStore } from '../store/useStore';
import { FileIcon } from './FileIcon';
import type { AssetType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileUpload {
  file: File;
  id: string;
  error?: string;
}

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.pdf', '.md'];

function getFileType(fileName: string): AssetType | null {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'csv':
      return 'csv';
    case 'xlsx':
      return 'xlsx';
    case 'pdf':
      return 'pdf';
    case 'md':
      return 'md';
    default:
      return null;
  }
}

function validateFile(file: File): string | null {
  const ext = '.' + file.name.toLowerCase().split('.').pop();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }
  return null;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { assets, addAsset, currentFolderId } = useStore();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(currentFolderId || 'root');
  const [isDragging, setIsDragging] = useState(false);

  const folders = assets.filter((a) => a.type === 'folder');
  const folderOptions = [
    { value: 'root', label: 'Root' },
    ...folders.map((f) => ({ value: f.id, label: f.name })),
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: FileUpload[] = droppedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      error: validateFile(file) || undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const newFiles: FileUpload[] = selectedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      error: validateFile(file) || undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleUpload = () => {
    const validFiles = files.filter((f) => !f.error);

    validFiles.forEach((fileUpload) => {
      const type = getFileType(fileUpload.file.name);
      if (type) {
        addAsset({
          name: fileUpload.file.name,
          type,
          size: fileUpload.file.size,
          parentId: selectedFolder === 'root' ? null : selectedFolder,
        });
      }
    });

    setFiles([]);
    onClose();
  };

  const validFilesCount = files.filter((f) => !f.error).length;

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files" size="lg">
      <div className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-[var(--radius-lg)] p-8
            transition-all duration-200
            ${isDragging
              ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-muted)]'
              : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
            }
          `}
        >
          <input
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center">
              <Upload size={24} className="text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-sm text-[var(--color-text-primary)] mb-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Supported: CSV, XLSX, PDF, Markdown
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
              Selected Files ({files.length})
            </h4>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              <AnimatePresence mode="popLayout">
                {files.map((fileUpload) => (
                  <motion.div
                    key={fileUpload.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]
                      ${fileUpload.error
                        ? 'bg-[var(--color-error-muted)] border border-[var(--color-error)]/30'
                        : 'bg-[var(--color-bg-elevated)]'
                      }
                    `}
                  >
                    {fileUpload.error ? (
                      <AlertCircle size={18} className="text-[var(--color-error)]" />
                    ) : (
                      <FileIcon type={getFileType(fileUpload.file.name) || 'md'} size={18} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">
                        {fileUpload.file.name}
                      </p>
                      {fileUpload.error && (
                        <p className="text-xs text-[var(--color-error)]">{fileUpload.error}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(fileUpload.id)}
                      className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          <Select
            label="Upload to folder"
            value={selectedFolder}
            onChange={setSelectedFolder}
            options={folderOptions}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={validFilesCount === 0}
          >
            Upload {validFilesCount > 0 ? `${validFilesCount} file${validFilesCount > 1 ? 's' : ''}` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
