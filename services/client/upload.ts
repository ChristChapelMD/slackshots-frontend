import { addToast } from "@heroui/toast";
import { upload } from "@vercel/blob/client";

import { UploadOptions } from "@/types/service-types/upload-service";

export async function uploadToBlob(
  files: FileList,
  uploadSessionId: string,
  onProgress?: (progress: number) => void,
) {
  const responses: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const response = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/uploads/blob",
    });

    responses.push(response);

    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return responses;
}

export async function uploadToSlack() {}

export async function uploadFiles({
  files,
  channel,
  comment,
  messageBatchSize,
  uploadSessionId,
  onProgress,
}: UploadOptions): Promise<boolean> {
  if (!files || files.length === 0) {
    throw new Error("No files selected for upload");
  }

  try {
    const filesList = Array.from(files);
    const totalFiles = filesList.length;
    let completedUploads = 0;

    const uploads = filesList.map((file) =>
      TusClient.uploadFile({
        file,
        metadata: {
          filename: file.name,
          filetype: file.type || getFileTypeByExtension(file.name),
          sessionID: uploadSessionId,
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
      }),
    );

    await Promise.all(uploads);

    await TusClient.finalizeUpload(uploadSessionId);

    addToast({
      title: "Upload Complete",
      description: `Successfully uploaded ${totalFiles} file${
        totalFiles !== 1 ? "s" : ""
      }`,
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

function getFileTypeByExtension(filename: string): string {
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
