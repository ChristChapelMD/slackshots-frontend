import { tmpdir } from "os";
import * as path from "path";
import * as fs from "fs/promises";

import { api } from "../index";

type Provider = "slack";

interface Credentials {
  botToken: string;
}

export async function processAndUpload(
  provider: Provider,
  credentials: Credentials,
  formData: FormData,
) {
  const tempFiles: { filename: string; file: string }[] = [];
  const channel = formData.get("channel") as string;
  const comment = formData.get("comment") as string;
  const files = formData.getAll("files") as File[];

  try {
    await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(tmpdir(), `${Date.now()}-${file.name}`);

        await fs.writeFile(tempFilePath, buffer);
        tempFiles.push({ filename: file.name, file: tempFilePath });
      }),
    );

    switch (provider) {
      case "slack":
        if (!channel) {
          throw new Error("Slack uploads require a 'channel' option.");
        }

        return await api.slack.upload.uploadFiles(
          credentials.botToken,
          tempFiles,
          channel,
          comment,
        );

      default:
        throw new Error(`Upload provider '${provider}' is not supported.`);
    }
  } catch (error) {
    console.error("Error during upload process:", error);
    throw error;
  } finally {
    for (const { file } of tempFiles) {
      fs.unlink(file).catch((err) =>
        console.warn(`Failed to clean up temp file ${file}:`, err),
      );
    }
  }
}
