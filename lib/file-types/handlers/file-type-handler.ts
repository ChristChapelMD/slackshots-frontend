import { FileItem } from "@/types/service-types/file-service";

/**
 * Supported view modes
 */
export type ViewMode = "grid" | "list" | "detail" | "preview";

/**
 * Base interface for all file type handlers
 */
export interface FileTypeHandler {
  typeId: string;
  displayName: string;
  iconName: string;
  supportedMimeTypes: string[];
  supportedExtensions: string[];
  canPreview: boolean;
  canHandle(file: FileItem): boolean;
  getRenderer(): React.ComponentType<{ item: FileItem }>; // Default renderer
  getGridRenderer?(): React.ComponentType<{ item: FileItem }>;
  getListRenderer?(): React.ComponentType<{ item: FileItem }>;
  getDetailRenderer?(): React.ComponentType<{ item: FileItem }>;
  getPreviewRenderer?(): React.ComponentType<{ item: FileItem }>;
  extractMetadata?(file: File): Promise<Record<string, any>>;
  generateThumbnail?(file: File): Promise<string>;
  getActions?(
    file: FileItem,
  ): { id: string; label: string; icon: string; action: () => void }[];
}
