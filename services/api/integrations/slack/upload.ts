import { createSlackClient } from "./client";

interface UploadResponse {
  id: string;
  url: string;
}

interface UploadResult {
  uploadResponseArray: UploadResponse[];
  fileMetadata: any; // Update with actual response from Slack for this method
}

export async function uploadFiles(
  accessToken: string,
  file_uploads: { filename: string; file: string }[],
  channel: string,
  comment?: string,
): Promise<UploadResult> {
  const client = createSlackClient(accessToken);

  try {
    // TODO - move to utils
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!channel) {
      throw new Error("No channel specifiresed");
    }

    const filesBuffers = await Promise.all(
      file_uploads.map(async ({ filename, file }) => {
        const res = await fetch(file);

        if (!res.ok) throw new Error(`Failed to fetch ${filename}`);
        const arrayBuffer = await res.arrayBuffer();

        return {
          filename,
          file: Buffer.from(arrayBuffer),
        };
      }),
    );

    // TODO - need to recreate the upload response instead of any
    const result: any = await client.files.uploadV2({
      channel_id: channel,
      initial_comment: comment || currentDate,
      file_uploads: filesBuffers,
    });

    const uploadResponseArray: UploadResponse[] = result.files.flatMap(
      (group: { files: { id: string; url_private: string }[] }) =>
        group.files.map((file) => ({
          id: file.id,
          url: file.url_private,
        })),
    );

    return {
      uploadResponseArray,
      fileMetadata: result.files,
    };
  } catch (error: any) {
    console.error(`Failed to upload files to Slack: ${error.message}`);
    throw error;
  }
}
