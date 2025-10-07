import { createSlackClient } from "./client";
import * as fs from "fs/promises";
import * as path from "path";
import { createWriteStream, createReadStream } from "fs";
import { pipeline } from "stream/promises";

interface UploadResponse {
  id: string;
  url: string;
}

interface UploadResult {
  uploadResponseArray: UploadResponse[];
  fileMetadata: any;
}

export async function uploadFiles(
  accessToken: string,
  file_uploads: { filename: string; file: string }[],
  channel: string,
  comment?: string,
  batchSize: number = 10,
): Promise<UploadResult> {
  const client = createSlackClient(accessToken);

  try {
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!channel) {
      throw new Error("No channel specified");
    }

    console.log(
      `Starting upload of ${file_uploads.length} files in batches of ${batchSize}`,
    );

    const allUploadResponses: UploadResponse[] = [];
    const allFileMetadata: any[] = [];

    // Process files in batches
    for (let i = 0; i < file_uploads.length; i += batchSize) {
      const batch = file_uploads.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(file_uploads.length / batchSize);

      console.log(
        `Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`,
      );

      const batchResult = await processBatch(
        client,
        batch,
        channel,
        batchNumber === 1 ? comment || currentDate : undefined,
      );

      allUploadResponses.push(...batchResult.uploadResponseArray);
      allFileMetadata.push(...batchResult.fileMetadata);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < file_uploads.length) {
        console.log("Waiting 1 second before next batch...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return {
      uploadResponseArray: allUploadResponses,
      fileMetadata: allFileMetadata,
    };
  } catch (error: any) {
    console.error(`Failed to upload files to Slack: ${error.message}`);
    throw error;
  }
}

async function processBatch(
  client: any,
  batch: { filename: string; file: string }[],
  channel: string,
  comment?: string,
): Promise<UploadResult> {
  const tmpFiles: string[] = []; // Keep track of temp files for cleanup

  try {
    // Step 1: Download files to /tmp directory using streams
    const filesBuffers = await Promise.all(
      batch.map(async ({ filename, file }) => {
        const tempFilePath = path.join(
          "/tmp",
          `${Date.now()}_${Math.random()}_${filename}`,
        );
        tmpFiles.push(tempFilePath);

        console.log(`Downloading ${filename} to ${tempFilePath}`);

        // Stream download to temp file
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${filename}: ${response.statusText}`,
          );
        }

        // Use Node.js streams to write directly to disk
        const writeStream = createWriteStream(tempFilePath);

        if (response.body) {
          // Convert web stream to node stream and pipe to file
          const nodeStream = response.body as any; // Web ReadableStream
          await pipeline(nodeStream, writeStream);
        } else {
          // Fallback for environments where response.body isn't available
          const buffer = await response.arrayBuffer();
          await fs.writeFile(tempFilePath, Buffer.from(buffer));
        }

        // Read the file back as buffer for Slack upload
        const fileBuffer = await fs.readFile(tempFilePath);

        return {
          filename,
          file: fileBuffer,
        };
      }),
    );

    // Step 2: Upload to Slack using your original method
    const result: any = await client.files.uploadV2({
      channel_id: channel,
      initial_comment: comment,
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
  } finally {
    // Step 3: Clean up temporary files (fire and forget)
    cleanupTempFiles(tmpFiles);
  }
}

// Clean up temp files without blocking
async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  // Don't await this - let it run in background
  Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
        console.log(`Cleaned up temp file: ${filePath}`);
      } catch (error) {
        // Ignore cleanup errors - files might already be gone
        console.warn(`Could not clean up temp file ${filePath}:`, error);
      }
    }),
  ).catch(() => {
    // Ignore any cleanup errors
  });
}

// Alternative streaming approach that reads from disk as needed
export async function uploadFilesStreamFromDisk(
  accessToken: string,
  file_uploads: { filename: string; file: string }[],
  channel: string,
  comment?: string,
  batchSize: number = 5, // Smaller batches since we're using disk
): Promise<UploadResult> {
  const client = createSlackClient(accessToken);

  try {
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!channel) {
      throw new Error("No channel specified");
    }

    const allUploadResponses: UploadResponse[] = [];
    const allFileMetadata: any[] = [];

    // Process files in smaller batches
    for (let i = 0; i < file_uploads.length; i += batchSize) {
      const batch = file_uploads.slice(i, i + batchSize);
      const tmpFiles: string[] = [];

      try {
        // Download batch to temp files
        const tempFilePaths = await Promise.all(
          batch.map(async ({ filename, file }) => {
            const tempFilePath = path.join(
              "/tmp",
              `${Date.now()}_${Math.random()}_${filename}`,
            );
            tmpFiles.push(tempFilePath);

            const response = await fetch(file);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${filename}`);
            }

            // Stream to temp file
            const writeStream = createWriteStream(tempFilePath);
            if (response.body) {
              await pipeline(response.body as any, writeStream);
            } else {
              const buffer = await response.arrayBuffer();
              await fs.writeFile(tempFilePath, Buffer.from(buffer));
            }

            return { filename, tempFilePath };
          }),
        );

        // Read files from disk one at a time (more memory efficient)
        const filesBuffers = await Promise.all(
          tempFilePaths.map(async ({ filename, tempFilePath }) => ({
            filename,
            file: await fs.readFile(tempFilePath),
          })),
        );

        // Upload batch to Slack
        const result: any = await client.files.uploadV2({
          channel_id: channel,
          initial_comment: i === 0 ? comment || currentDate : undefined,
          file_uploads: filesBuffers,
        });

        const uploadResponseArray: UploadResponse[] = result.files.flatMap(
          (group: { files: { id: string; url_private: string }[] }) =>
            group.files.map((file) => ({
              id: file.id,
              url: file.url_private,
            })),
        );

        allUploadResponses.push(...uploadResponseArray);
        allFileMetadata.push(...result.files);
      } finally {
        // Clean up this batch's temp files
        cleanupTempFiles(tmpFiles);
      }

      // Delay between batches
      if (i + batchSize < file_uploads.length) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    return {
      uploadResponseArray: allUploadResponses,
      fileMetadata: allFileMetadata,
    };
  } catch (error: any) {
    console.error(`Failed to upload files to Slack: ${error.message}`);
    throw error;
  }
}
