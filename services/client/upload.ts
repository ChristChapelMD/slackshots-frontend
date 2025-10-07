import { upload } from "@vercel/blob/client";

export async function uploadToBlob( // Fix type later
  files: FileList,
  channel: string,
  uploadSessionId: string,
  onProgress?: (progress: number) => void,
) {
  if (!files || files.length === 0) throw new Error("No files selected");
  if (!channel) throw new Error("No channel selected");
  if (!uploadSessionId) throw new Error("No upload session");

  const batchSize = 5;
  const responses: any[] = [];
  const fileArray = Array.from(files);

  for (let i = 0; i < fileArray.length; i += batchSize) {
    const batch = fileArray.slice(i, i + batchSize);

    // upload batch in parallel
    const settled = await Promise.allSettled(
      batch.map((file) =>
        upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/uploads/blob",
          clientPayload: JSON.stringify({
            uploadSessionId,
            fileSize: file.size,
            fileType: file.type,
          }),
        }),
      ),
    );

    // process results
    settled.forEach((result, index) => {
      if (result.status === "fulfilled") {
        responses.push({
          response: result.value,
          originalFileName: batch[index].name,
        });
      } else {
        console.error(`File failed: ${batch[index].name}`, result.reason);
      }
    });
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
