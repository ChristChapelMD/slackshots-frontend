import { upload } from "@vercel/blob/client";

import { UploadOptions } from "@/types/service-types/upload-service";

export async function uploadToBlob( // Fix type later
  files: FileList,
  channel: string,
  comment: string,
  messageBatchSize: number,
  uploadSessionId: string,
  onProgress?: (progress: number) => void,
) {
  if (!files || files.length === 0) {
    throw new Error("No files selected for upload");
  }
  if (!channel) {
    throw new Error("No channel selected for upload");
  }
  if (!uploadSessionId) {
    throw new Error("No upload session set for upload");
  }

  const responses: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const response = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/uploads/blob",
      clientPayload: JSON.stringify({
        // Figure out why this isnt working
        uploadSessionId,
        fileSize: file.size,
        fileType: file.type,
      }),
    });

    responses.push({
      response,
      orginalFileName: file.name,
    });

    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return responses;
}

export async function uploadToSlack(
  responses: any[],
  channel: string,
  comment: string,
  messageBatchSize: number,
) {
  const response = await fetch("/api/uploads/slack", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });

  if (!response.ok) {
    throw new Error("Failed to upload files to Slack");
  }

  const data = await response.json();

  return data;
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
