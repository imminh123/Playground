import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Eye,
  ChevronLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Tag } from './Tag';
import { FileIcon } from './FileIcon';
import type { Asset, ExperienceInventory } from '../types';

type SortField = 'name' | 'type' | 'modifiedAt' | 'size';
type SortDirection = 'asc' | 'desc';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function AssetTable() {
  const navigate = useNavigate();
  const {
    assets,
    experienceInventories,
    tags,
    currentFolderId,
    filterTagIds,
    searchQuery,
    setCurrentFolder,
    openModal,
  } = useStore();

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const currentFolder = currentFolderId
    ? assets.find((a) => a.id === currentFolderId)
    : null;

  const allItems = useMemo(() => {
    const items: (Asset | ExperienceInventory)[] = [
      ...assets,
      ...experienceInventories,
    ];
    return items;
  }, [assets, experienceInventories]);

  const displayedItems = useMemo(() => {
    let filtered = allItems.filter((item) => item.parentId === currentFolderId);

    if (filterTagIds.length > 0) {
      filtered = filtered.filter((item) =>
        filterTagIds.some((tagId) => item.tags.includes(tagId))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'modifiedAt':
          comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Folders first
    return filtered.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return 0;
    });
  }, [allItems, currentFolderId, filterTagIds, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-[var(--color-text-muted)]" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="text-[var(--color-accent-primary)]" />
    ) : (
      <ArrowDown size={14} className="text-[var(--color-accent-primary)]" />
    );
  };

  const handleRowClick = (item: Asset | ExperienceInventory) => {
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
    } else if (item.type === 'experience-inventory') {
      navigate(`/inventory/${item.id}`);
    }
  };

  const getItemTags = (tagIds: string[]) => {
    return tags.filter((tag) => tagIds.includes(tag.id));
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {currentFolder && (
        <div className="px-6 py-3 border-b border-[var(--color-border-subtle)]">
          <button
            onClick={() => setCurrentFolder(null)}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to root</span>
          </button>
          <h2 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
            {currentFolder.name}
          </h2>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--color-bg-secondary)] z-10">
            <tr className="border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  Type
                  <SortIcon field="type" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  Tags
                </span>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('modifiedAt')}
                  className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  Modified
                  <SortIcon field="modifiedAt" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('size')}
                  className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  Size
                  <SortIcon field="size" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  onClick={() => handleRowClick(item)}
                  className={`
                    border-b border-[var(--color-border-subtle)]
                    hover:bg-[var(--color-bg-hover)] transition-colors
                    ${item.type === 'folder' || item.type === 'experience-inventory' ? 'cursor-pointer' : ''}
                  `}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <FileIcon type={item.type} />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--color-text-secondary)] capitalize">
                      {item.type === 'experience-inventory' ? 'Inventory' : item.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {getItemTags(item.tags).slice(0, 3).map((tag) => (
                        <Tag key={tag.id} name={tag.name} color={tag.color} size="sm" />
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-[var(--color-text-muted)] px-1">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {format(new Date(item.modifiedAt), 'MMM d, yyyy')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {formatFileSize(item.size)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                        className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      <AnimatePresence>
                        {openMenuId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-full mt-1 py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] min-w-[140px] z-20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.type === 'experience-inventory' && (
                              <button
                                onClick={() => {
                                  navigate(`/inventory/${item.id}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            )}
                            <button
                              onClick={() => {
                                openModal('edit-asset', item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            {item.type !== 'folder' && item.type !== 'experience-inventory' && (
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                              >
                                <Download size={14} />
                                Download
                              </button>
                            )}
                            <button
                              onClick={() => {
                                openModal('delete-asset', item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 flex items-center gap-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-muted)] transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {displayedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center">
              <FileIcon type="folder" size={24} />
            </div>
            <p className="text-[var(--color-text-secondary)] mb-1">No assets found</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {searchQuery || filterTagIds.length > 0
                ? 'Try adjusting your filters'
                : 'Upload files or create a folder to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
