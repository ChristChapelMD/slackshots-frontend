import { createSlackClient } from "./client";

export async function uploadFilesByChannel(
  accessToken: string,
  file_uploads: { filename: string; file: string }[],
  channel: string,
  comment?: string,
): Promise<{ id: string; url_private: string }[]> {
  const client = createSlackClient(accessToken);

  try {
    //move to utils
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!channel) {
      throw new Error("No channel specified");
    }

    const response: any = await client.files.uploadV2({
      channel_id: channel,
      initial_comment: comment || currentDate,
      file_uploads: file_uploads,
    });

    console.log(response.files[0]);

    return response.files.flatMap(
      (fileGroup: { files: { id: string; url_private: string }[] }) =>
        fileGroup.files.map((file: { id: string; url_private: string }) => ({
          id: file.id,
          url_private: file.url_private,
        })),
    );
  } catch (error: any) {
    console.error(`Failed to upload files to Slack: ${error.message}`);
    throw error;
  }
}
