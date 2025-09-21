import { createSlackClient } from "./client";

interface UploadResponse {
  id: string;
  url: string;
}

interface UploadResult {
  uploadResponseArray: UploadResponse[];
  fileMetadata: any; // Update with actual response from Slack for this method
}

export async function uploadFilesByChannel(
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

    // TODO - need to recreate the upload response instead of any
    const result: any = await client.files.uploadV2({
      channel_id: channel,
      initial_comment: comment || currentDate,
      file_uploads: file_uploads,
    });

    return {
      uploadResponseArray: result.files.flatMap(
        (fileGroup: { files: { id: string; url_private: string }[] }) =>
          fileGroup.files.map((file) => ({
            id: file.id,
            url: file.url_private,
          })),
      ),
      fileMetadata: result.files,
    };
  } catch (error: any) {
    console.error(`Failed to upload files to Slack: ${error.message}`);
    throw error;
  }
}
