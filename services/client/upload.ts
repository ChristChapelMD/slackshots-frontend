import { upload } from "@vercel/blob/client";

export async function uploadToBlob( // Fix type later
  files: FileList,
  channel: string,
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
      originalFileName: file.name,
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
  const slackUpoadsResponse: any[] = [];

  for (let i = 0; i < responses.length; i += messageBatchSize) {
    const batch = responses.slice(i, i + messageBatchSize);

    const slackPayload = batch.map((file) => ({
      filename: file.originalFileName,
      file: file.response.url,
    }));

    const response = await fetch("/api/uploads/slack", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses: slackPayload, channel, comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload files to Slack");
    }

    const data = await response.json();

    slackUpoadsResponse.push(data);
  }

  return slackUpoadsResponse;
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
