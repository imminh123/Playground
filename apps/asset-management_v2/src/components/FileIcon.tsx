import { Folder, FileSpreadsheet, FileText, FileType, File, Database } from 'lucide-react';
import type { AssetType } from '../types';

interface FileIconProps {
  type: AssetType;
  size?: number;
}

export function FileIcon({ type, size = 20 }: FileIconProps) {
  const iconProps = { size, strokeWidth: 1.5 };

  switch (type) {
    case 'folder':
      return <Folder {...iconProps} className="text-[var(--color-tag-amber)]" />;
    case 'csv':
      return <FileSpreadsheet {...iconProps} className="text-[var(--color-tag-emerald)]" />;
    case 'xlsx':
      return <FileSpreadsheet {...iconProps} className="text-[var(--color-tag-emerald)]" />;
    case 'pdf':
      return <FileText {...iconProps} className="text-[var(--color-tag-rose)]" />;
    case 'md':
      return <FileType {...iconProps} className="text-[var(--color-tag-blue)]" />;
    case 'experience-inventory':
      return <Database {...iconProps} className="text-[var(--color-tag-violet)]" />;
    default:
      return <File {...iconProps} className="text-[var(--color-text-tertiary)]" />;
  }
}
