import { FileTypeHandler } from "./handlers/file-type-handler";

/**
 * Registry for all file type handlers
 */
export class FileTypeRegistry {
  private handlers: Map<string, FileTypeHandler> = new Map();
  private mimeTypeMap: Map<string, string> = new Map();
  private extensionMap: Map<string, string> = new Map();

  /**
   * Register a new file type handler
   */
  register(handler: FileTypeHandler): void {
    const typeId = handler.typeId;

    this.handlers.set(typeId, handler);

    handler.supportedMimeTypes.forEach((mimeType) => {
      this.mimeTypeMap.set(mimeType, typeId);
    });

    handler.supportedExtensions.forEach((ext) => {
      this.extensionMap.set(ext.toLowerCase(), typeId);
    });
  }

  /**
   * Get a handler by file type ID
   */
  getHandler(typeId: string): FileTypeHandler | undefined {
    return this.handlers.get(typeId);
  }

  /**
   * Get a handler by MIME type
   */
  getHandlerForMimeType(mimeType: string): FileTypeHandler | undefined {
    const typeId = this.mimeTypeMap.get(mimeType);

    return typeId ? this.handlers.get(typeId) : undefined;
  }

  /**
   * Get a handler by file extension
   */
  getHandlerForExtension(extension: string): FileTypeHandler | undefined {
    const ext = extension.toLowerCase().replace(/^\./, "");
    const typeId = this.extensionMap.get(ext);

    return typeId ? this.handlers.get(typeId) : undefined;
  }

  /**
   * Get all registered handlers
   */
  getAllHandlers(): FileTypeHandler[] {
    return Array.from(this.handlers.values());
  }

  /**
   * Get supported mime types
   */
  getSupportedMimeTypes(): string[] {
    return Array.from(this.mimeTypeMap.keys());
  }

  /**
   * Get supported file extensions
   */
  getSupportedExtensions(): string[] {
    return Array.from(this.extensionMap.keys());
  }
}

export const fileTypeRegistry = new FileTypeRegistry();
