import { fileTypeRegistry } from "./file-type-registry";
import { ImageHandler } from "./handlers/image-handler";

/**
 * Initialize the file type registry with default handlers
 */
export function initializeFileTypeRegistry() {
  fileTypeRegistry.register(new ImageHandler());
}
