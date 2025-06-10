import { addToast } from "@heroui/toast";

import { APIService } from "../api-service";

import TusClient from "@/lib/tus-client";
import {
  UploadServiceInterface,
  UploadOptions,
} from "@/types/service-types/upload-service";

export class UploadService
  extends APIService
  implements UploadServiceInterface
{
  async uploadFiles({
    files,
    channel,
    comment,
    messageBatchSize,
    sessionId,
    onProgress,
  }: UploadOptions): Promise<boolean> {
    if (!files || files.length === 0) {
      throw new Error("No files selected for upload");
    }

    try {
      const filesList = Array.from(files);
      let completedUploads = 0;
      const totalFiles = filesList.length;

      const uploads = filesList.map((file) => {
        return TusClient.uploadFile({
          file,
          metadata: {
            filename: file.name,
            filetype: file.type || this.getFileTypeByExtension(file.name),
            sessionID: sessionId,
            channel,
            comment,
            messageBatchSize,
          },
          onProgress: (fileProgress) => {
            if (onProgress) {
              const averageProgress = Math.round(
                (completedUploads * 100 + fileProgress) / totalFiles,
              );

              onProgress(averageProgress);
            }
          },
          onSuccess: () => {
            completedUploads++;
            if (onProgress) {
              const overallProgress = Math.round(
                (completedUploads / totalFiles) * 100,
              );

              onProgress(overallProgress);
            }
          },
        });
      });

      await Promise.all(uploads);

      await TusClient.finalizeUpload(sessionId);

      addToast({
        title: "Upload Complete",
        description: `Successfully uploaded ${totalFiles} file${totalFiles !== 1 ? "s" : ""}`,
        severity: "success",
        color: "success",
        timeout: 5000,
      });

      return true;
    } catch (error) {
      addToast({
        title: "Upload Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during upload",
        severity: "danger",
        color: "danger",
        timeout: 7000,
      });

      throw error;
    }
  }

  private getFileTypeByExtension(filename: string): string {
    const extension = filename.toLowerCase().split(".").pop() || "";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    return mimeTypes[extension] || "application/octet-stream";
  }
}
