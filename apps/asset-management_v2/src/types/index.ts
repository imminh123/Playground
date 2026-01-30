export type AssetType = 'folder' | 'csv' | 'xlsx' | 'pdf' | 'md' | 'experience-inventory';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  modifiedAt: Date;
  size: number;
  parentId: string | null;
}

export interface Folder extends Asset {
  type: 'folder';
}

export interface Document extends Asset {
  type: 'csv' | 'xlsx' | 'pdf' | 'md';
}

export interface ExperienceInventory extends Asset {
  type: 'experience-inventory';
  schema: SchemaColumn[];
  entries: Record<string, unknown>[];
}

export interface SchemaColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select';
  options?: string[];
  required?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'knowledge-retrieval' | 'planning';
  enabled: boolean;
  config: KnowledgeRetrievalConfig | PlanningConfig;
}

export interface KnowledgeRetrievalConfig {
  assetIds: string[];
}

export interface PlanningConfig {
  experienceInventoryId: string | null;
}

export interface Companion {
  id: string;
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  skillIds: string[];
}

export type ModalType =
  | 'upload'
  | 'create-folder'
  | 'edit-asset'
  | 'delete-asset'
  | 'create-inventory'
  | 'edit-inventory-entry'
  | 'create-schema';

export interface ModalState {
  type: ModalType | null;
  data?: unknown;
}
