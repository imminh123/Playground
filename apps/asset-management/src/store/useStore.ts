import { create } from 'zustand';
import type { Asset, Tag, ExperienceInventory, Skill, ModalState, Companion } from '../types';
import { mockAssets, mockTags, mockExperienceInventories, mockSkills, mockCompanions } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface StoreState {
  // Data
  assets: Asset[];
  experienceInventories: ExperienceInventory[];
  tags: Tag[];
  skills: Skill[];
  companions: Companion[];

  // UI State
  currentFolderId: string | null;
  selectedAssetIds: string[];
  filterTagIds: string[];
  searchQuery: string;
  modal: ModalState;
  activeTab: 'assets' | 'companion';
  selectedCompanionId: string | null;

  // Actions - Assets
  addAsset: (asset: Omit<Asset, 'id' | 'modifiedAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  setCurrentFolder: (folderId: string | null) => void;

  // Actions - Experience Inventories
  addExperienceInventory: (inventory: Omit<ExperienceInventory, 'id' | 'modifiedAt' | 'size'>) => void;
  updateExperienceInventory: (id: string, updates: Partial<ExperienceInventory>) => void;
  deleteExperienceInventory: (id: string) => void;
  addInventoryEntry: (inventoryId: string, entry: Record<string, unknown>) => void;
  updateInventoryEntry: (inventoryId: string, entryId: string, updates: Record<string, unknown>) => void;
  deleteInventoryEntry: (inventoryId: string, entryId: string) => void;

  // Actions - Tags
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateAssetTags: (assetId: string, tagIds: string[]) => void;

  // Actions - Skills
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  toggleSkill: (id: string) => void;

  // Actions - Companions
  updateCompanion: (id: string, updates: Partial<Companion>) => void;
  setSelectedCompanion: (id: string | null) => void;
  toggleCompanionSkill: (companionId: string, skillId: string) => void;

  // Actions - UI
  setSelectedAssets: (ids: string[]) => void;
  setFilterTags: (tagIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  openModal: (type: ModalState['type'], data?: unknown) => void;
  closeModal: () => void;
  setActiveTab: (tab: 'assets' | 'companion') => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial Data
  assets: mockAssets,
  experienceInventories: mockExperienceInventories,
  tags: mockTags,
  skills: mockSkills,
  companions: mockCompanions,

  // Initial UI State
  currentFolderId: null,
  selectedAssetIds: [],
  filterTagIds: [],
  searchQuery: '',
  modal: { type: null },
  activeTab: 'assets',
  selectedCompanionId: null,

  // Asset Actions
  addAsset: (asset) => {
    const newAsset: Asset = {
      ...asset,
      id: uuidv4(),
      modifiedAt: new Date(),
    };
    set((state) => ({ assets: [...state.assets, newAsset] }));
  },

  updateAsset: (id, updates) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, ...updates, modifiedAt: new Date() } : asset
      ),
    }));
  },

  deleteAsset: (id) => {
    set((state) => ({
      assets: state.assets.filter(
        (asset) => asset.id !== id && asset.parentId !== id
      ),
    }));
  },

  setCurrentFolder: (folderId) => {
    set({ currentFolderId: folderId, selectedAssetIds: [] });
  },

  // Experience Inventory Actions
  addExperienceInventory: (inventory) => {
    const newInventory: ExperienceInventory = {
      ...inventory,
      id: uuidv4(),
      modifiedAt: new Date(),
      size: 0,
    };
    set((state) => ({
      experienceInventories: [...state.experienceInventories, newInventory],
    }));
  },

  updateExperienceInventory: (id, updates) => {
    set((state) => ({
      experienceInventories: state.experienceInventories.map((inv) =>
        inv.id === id ? { ...inv, ...updates, modifiedAt: new Date() } : inv
      ),
    }));
  },

  deleteExperienceInventory: (id) => {
    set((state) => ({
      experienceInventories: state.experienceInventories.filter((inv) => inv.id !== id),
    }));
  },

  addInventoryEntry: (inventoryId, entry) => {
    set((state) => ({
      experienceInventories: state.experienceInventories.map((inv) =>
        inv.id === inventoryId
          ? {
              ...inv,
              entries: [...inv.entries, { ...entry, id: uuidv4() }],
              modifiedAt: new Date(),
            }
          : inv
      ),
    }));
  },

  updateInventoryEntry: (inventoryId, entryId, updates) => {
    set((state) => ({
      experienceInventories: state.experienceInventories.map((inv) =>
        inv.id === inventoryId
          ? {
              ...inv,
              entries: inv.entries.map((entry) =>
                (entry as { id: string }).id === entryId ? { ...entry, ...updates } : entry
              ),
              modifiedAt: new Date(),
            }
          : inv
      ),
    }));
  },

  deleteInventoryEntry: (inventoryId, entryId) => {
    set((state) => ({
      experienceInventories: state.experienceInventories.map((inv) =>
        inv.id === inventoryId
          ? {
              ...inv,
              entries: inv.entries.filter((entry) => (entry as { id: string }).id !== entryId),
              modifiedAt: new Date(),
            }
          : inv
      ),
    }));
  },

  // Tag Actions
  addTag: (tag) => {
    const newTag: Tag = { ...tag, id: uuidv4() };
    set((state) => ({ tags: [...state.tags, newTag] }));
    return newTag;
  },

  updateAssetTags: (assetId, tagIds) => {
    const { assets, experienceInventories } = get();
    const asset = assets.find((a) => a.id === assetId);
    const inventory = experienceInventories.find((i) => i.id === assetId);

    if (asset) {
      set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId ? { ...a, tags: tagIds, modifiedAt: new Date() } : a
        ),
      }));
    } else if (inventory) {
      set((state) => ({
        experienceInventories: state.experienceInventories.map((i) =>
          i.id === assetId ? { ...i, tags: tagIds, modifiedAt: new Date() } : i
        ),
      }));
    }
  },

  // Skill Actions
  updateSkill: (id, updates) => {
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    }));
  },

  toggleSkill: (id) => {
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, enabled: !skill.enabled } : skill
      ),
    }));
  },

  // Companion Actions
  updateCompanion: (id, updates) => {
    set((state) => ({
      companions: state.companions.map((companion) =>
        companion.id === id ? { ...companion, ...updates } : companion
      ),
    }));
  },

  setSelectedCompanion: (id) => {
    set({ selectedCompanionId: id });
  },

  toggleCompanionSkill: (companionId, skillId) => {
    set((state) => ({
      companions: state.companions.map((companion) => {
        if (companion.id !== companionId) return companion;
        const hasSkill = companion.skillIds.includes(skillId);
        return {
          ...companion,
          skillIds: hasSkill
            ? companion.skillIds.filter((id) => id !== skillId)
            : [...companion.skillIds, skillId],
        };
      }),
    }));
  },

  // UI Actions
  setSelectedAssets: (ids) => set({ selectedAssetIds: ids }),
  setFilterTags: (tagIds) => set({ filterTagIds: tagIds }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openModal: (type, data) => set({ modal: { type, data } }),
  closeModal: () => set({ modal: { type: null } }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
