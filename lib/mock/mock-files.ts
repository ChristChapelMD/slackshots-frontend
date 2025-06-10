import { FileItem, FileMetadata } from "@/types/service-types/file-service";

let fileCache: Record<string, FileMetadata> = {};

/**
 * Generate deterministic mock files
 * Using deterministic generation ensures consistency across renders
 */
export function generateMockFiles(count = 20, startIndex = 0): FileItem[] {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const id = `file-${index.toString().padStart(3, "0")}`;

    // Use deterministic sizing based on index
    const sizeIndex = index % 5;
    const sizePatterns = [
      { width: 400, height: 300 }, // landscape
      { width: 300, height: 400 }, // portrait
      { width: 500, height: 500 }, // square
      { width: 600, height: 400 }, // wide
      { width: 400, height: 600 }, // tall
    ];

    // Create the file item
    const file: FileItem = {
      fileID: id,
      name: `File ${index + 1}`,
      fileType: "image/jpeg",
      uploadDate: new Date(Date.now() - index * 86400000).toISOString(),
      fileSize: 500000 + index * 100000,
      width: sizePatterns[sizeIndex].width,
      height: sizePatterns[sizeIndex].height,
      url: `https://picsum.photos/${sizePatterns[sizeIndex].width}/${sizePatterns[sizeIndex].height}?seed=${id}`, // Use a seed for consistent images
    };

    // Store in cache for getFileMetadata
    if (!fileCache[id]) {
      fileCache[id] = {
        ...file,
        createdBy: "Demo User",
        channel: "#random",
        exif: {
          camera: "Canon EOS R5",
          focalLength: "24mm",
          aperture: "f/2.8",
          iso: "100",
          shutterSpeed: "1/125s",
        },
      };
    }

    return file;
  });
}

/**
 * Get detailed metadata for a specific file
 */
export function getFileMockMetadata(fileID: string): FileMetadata | null {
  // If not in cache, try to generate it
  if (!fileCache[fileID]) {
    try {
      const idNumber = parseInt(fileID.split("-")[1], 10);

      generateMockFiles(1, idNumber - 1);
    } catch (error) {
      throw new Error(`Error generating mock file metadata: ${error}`);
    }
  }

  return fileCache[fileID] || null;
}

/**
 * Delete a mock file from the cache
 */
export function deleteMockFile(fileID: string): boolean {
  if (fileCache[fileID]) {
    delete fileCache[fileID];

    return true;
  }

  return false;
}

/**
 * Delete multiple mock files from the cache
 */
export function bulkDeleteMockFiles(fileIDs: string[]): number {
  let count = 0;

  fileIDs.forEach((id) => {
    if (deleteMockFile(id)) {
      count++;
    }
  });

  return count;
}

/**
 * Clear all mock files (for testing)
 */
export function clearMockFiles(): void {
  fileCache = {};
}

/**
 * Add a mock file to the cache
 */
export function addMockFile(file: Partial<FileItem>): FileMetadata {
  // Generate a new unique ID
  const newIndex = Object.keys(fileCache).length;
  const fileID = `file-${newIndex.toString().padStart(3, "0")}`;

  // Generate default properties for any missing fields
  const sizeIndex = newIndex % 5;
  const sizePatterns = [
    { width: 400, height: 300 },
    { width: 300, height: 400 },
    { width: 500, height: 500 },
    { width: 600, height: 400 },
    { width: 400, height: 600 },
  ];

  // Create new file with provided + default properties
  const newFile: FileItem = {
    fileID,
    name: file.name || `Uploaded File ${newIndex + 1}`,
    fileType: file.fileType || "image/jpeg",
    uploadDate: new Date().toISOString(),
    fileSize: file.fileSize || 1200000,
    width: file.width || sizePatterns[sizeIndex].width,
    height: file.height || sizePatterns[sizeIndex].height,
    url:
      file.url ||
      `https://picsum.photos/${sizePatterns[sizeIndex].width}/${sizePatterns[sizeIndex].height}?seed=${fileID}`,
    ...file, // Override defaults with any provided values
  };

  // Create full metadata
  const metadata: FileMetadata = {
    ...newFile,
    createdBy: "Current User",
    channel: "#general",
    exif: {
      camera: "iPhone 14 Pro",
      focalLength: "26mm",
      aperture: "f/1.8",
      iso: "400",
      shutterSpeed: "1/60s",
    },
  };

  // Store in cache
  fileCache[fileID] = metadata;

  return metadata;
}
