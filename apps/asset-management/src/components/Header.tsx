import { Search, Upload, FolderPlus, Database, X } from 'lucide-react';
import { Button } from './Button';
import { TagMultiSelect } from './TagInput';
import { useStore } from '../store/useStore';

export function Header() {
  const {
    searchQuery,
    setSearchQuery,
    filterTagIds,
    setFilterTags,
    openModal,
    activeTab,
    setActiveTab,
  } = useStore();

  return (
    <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-tag-violet)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Asset Management
          </h1>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-lg)]">
          <button
            onClick={() => setActiveTab('assets')}
            className={`
              px-4 py-1.5 text-sm font-medium rounded-[var(--radius-md)] transition-all
              ${activeTab === 'assets'
                ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }
            `}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab('companion')}
            className={`
              px-4 py-1.5 text-sm font-medium rounded-[var(--radius-md)] transition-all
              ${activeTab === 'companion'
                ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }
            `}
          >
            Companion
          </button>
        </nav>

        {/* Actions (only show on Assets tab) */}
        {activeTab === 'assets' && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('create-inventory')}
            >
              <Database size={16} />
              New Inventory
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('create-folder')}
            >
              <FolderPlus size={16} />
              New Folder
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModal('upload')}
            >
              <Upload size={16} />
              Upload
            </Button>
          </div>
        )}

        {/* Spacer for Companion tab */}
        {activeTab === 'companion' && <div className="w-[200px]" />}
      </div>

      {/* Search & Filter Bar (only show on Assets tab) */}
      {activeTab === 'assets' && (
        <div className="px-6 py-3 flex items-center gap-4 border-t border-[var(--color-border-subtle)]">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag Filter */}
          <div className="w-64">
            <TagMultiSelect
              selectedTagIds={filterTagIds}
              onChange={setFilterTags}
              placeholder="Filter by tags..."
            />
          </div>

          {/* Active Filters */}
          {(filterTagIds.length > 0 || searchQuery) && (
            <button
              onClick={() => {
                setFilterTags([]);
                setSearchQuery('');
              }}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </header>
  );
}
