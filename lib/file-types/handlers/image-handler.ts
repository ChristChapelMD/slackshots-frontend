import { lazy } from "react";

import { FileTypeHandler } from "./file-type-handler";

import { FileItem } from "@/types/service-types/file-service";

const ImageGridRenderer = lazy(
  () => import("@/components/file-types/images/displays/image-grid"),
);
const ImageListRenderer = lazy(
  () => import("@/components/file-types/images/displays/image-list"),
);
const ImagePreviewRenderer = lazy(
  () => import("@/components/file-types/images/displays/image-preview"),
);
const ImageDetailRenderer = lazy(
  () => import("@/components/file-types/images/displays/image-detail"),
);

/**
 * Handler for image file types
 */
export class ImageHandler implements FileTypeHandler {
  typeId = "image";
  displayName = "Image";
  iconName = "image";
  canPreview = true;

  supportedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  supportedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  canHandle(file: FileItem): boolean {
    return (
      this.supportedMimeTypes.includes(file.fileType) ||
      this.supportedExtensions.some((ext) =>
        file.fileName.toLowerCase().endsWith(`.${ext}`),
      )
    );
  }

  getRenderer() {
    return ImageGridRenderer;
  }

  getGridRenderer() {
    return ImageGridRenderer;
  }

  getListRenderer() {
    return ImageListRenderer;
  }

  getDetailRenderer() {
    return ImageDetailRenderer;
  }

  getPreviewRenderer() {
    return ImagePreviewRenderer;
  }

  async extractMetadata(file: File): Promise<Record<string, any>> {
    const url = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const metadata = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        };

        URL.revokeObjectURL(url);
        resolve(metadata);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image for metadata extraction"));
      };

      img.src = url;
    });
  }

  async generateThumbnail(file: File): Promise<string> {
    // if (file.thumbnailUrl) {
    //   return file.thumbnailUrl;
    // }

    return URL.createObjectURL(file);
  }

  getActions(file: FileItem) {
    const providerFileId = file.uploads?.[0]?.providerFileId;
    const fileUrl = providerFileId ? `/api/files/${providerFileId}` : null;

    return [
      {
        id: "download",
        label: "Download",
        icon: "download",
        action: () =>
          fileUrl && window.open(fileUrl, "_blank", "noopener,noreferrer"),
      },
      {
        id: "edit",
        label: "Edit",
        icon: "edit",
        action: () => {},
      },
      {
        id: "share",
        label: "Share",
        icon: "share",
        action: () => {},
      },
    ];
  }
}
