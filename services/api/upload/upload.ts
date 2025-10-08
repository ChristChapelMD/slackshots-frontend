import { tmpdir } from "os";
import * as path from "path";
import * as fs from "fs/promises";

import { ObjectId } from "mongodb";

import { api } from "../index";

type Provider = "slack";

interface Credentials {
  botToken: string;
  userId: ObjectId;
  workspaceId: ObjectId;
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
  const uploadSessionId = formData.get("uploadSessionId") as string;

  try {
    const fileInfoForDB = files.map((file) => ({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }));

    const fileRecords = await api.db.file.findOrCreateFileRecordsForBatch(
      fileInfoForDB,
      uploadSessionId,
      credentials.userId,
      credentials.workspaceId,
    );

    await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(tmpdir(), `${Date.now()}-${file.name}`);

        await fs.writeFile(tempFilePath, buffer);
        tempFiles.push({ filename: file.name, file: tempFilePath });
      }),
    );

    let uploadResult;

    switch (provider) {
      case "slack":
        if (!channel) {
          throw new Error("Slack uploads require a 'channel' option.");
        }

        uploadResult = await api.slack.upload.uploadFiles(
          credentials.botToken,
          tempFiles,
          channel,
          comment,
        );

        break;

      default:
        throw new Error(`Upload provider '${provider}' is not supported.`);
    }

    const slackFileResponses = uploadResult.fileMetadata.flatMap(
      (response: any) => response.files,
    );

    await Promise.all(
      slackFileResponses.map((slackFile: any) => {
        const record = fileRecords.find(
          (fileRecord) => fileRecord.fileName === slackFile.name,
        );

        if (!record) return null;

        return api.db.file.addUploadToRecord(record._id, {
          provider: "slack",
          providerFileId: slackFile.id,
          providerFileUrl: slackFile.url_private,
        });
      }),
    );

    return uploadResult;
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
