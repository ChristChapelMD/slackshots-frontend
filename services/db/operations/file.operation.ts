import mongoose from "mongoose";

import { File, IFile, FileStatus } from "../models/file.model";

export type FileRecordData = Pick<
  IFile,
  | "fileName"
  | "blobUrl"
  | "fileSize"
  | "uploadSessionId"
  | "userId"
  | "workspaceId"
  | "fileType"
> & {};

export type FileUpdateDetails = {
  slackFileId?: string;
  slackFileUrl?: string;
  errorMessage?: string;
  aiTags?: string[];
  moderationFlag?: boolean;
};

export async function createFileRecord(data: FileRecordData) {
  const file = new File({
    ...data,
    status: FileStatus.PENDING,
  });

  return await file.save();
}

export async function updateFileRecord(
  fileId: mongoose.Types.ObjectId,
  status: FileStatus,
  details: FileUpdateDetails = {},
) {
  return await File.findByIdAndUpdate(
    fileId,
    { status, ...details },
    { new: true },
  );
}

export async function getPendingFilesBySession(uploadSessionID: string) {
  return await File.find({ uploadSessionID, status: FileStatus.PENDING }).sort({
    createdAt: 1,
  });
}

export async function getFailedFilesBySession(uploadSessionID: string) {
  return await File.find({ uploadSessionID, status: FileStatus.FAILED }).sort({
    createdAt: 1,
  });
}

export async function getFilesForUser(
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 16,
) {
  return await File.find({ userId, status: FileStatus.UPLOADED_TO_SLACK })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function getFilesForWorkspace(
  workspaceId: string,
  page: number = 1,
  limit: number = 16,
) {
  return await File.find({ workspaceId, status: FileStatus.UPLOADED_TO_SLACK })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function markFileAsFailed(
  fileId: mongoose.Types.ObjectId,
  errorMessage?: string,
) {
  return await updateFileRecord(fileId, FileStatus.FAILED, {
    errorMessage,
  });
}

export async function bulkUpdateFilesStatus(
  fileIds: mongoose.Types.ObjectId[],
  status: FileStatus,
  details: FileUpdateDetails = {},
) {
  return await File.updateMany(
    { _id: { $in: fileIds } },
    { status, ...details },
  );
}

export const anonymizeFileRecord = async (
  userId: mongoose.Types.ObjectId,
  fileIds: string[],
) => {
  if (!fileIds.length) {
    return 0;
  }

  try {
    const result = await File.updateMany(
      { userId, slackFileID: { $in: fileIds } },
      {
        $unset: {
          name: "",
          slackFileID: "",
          slackFileURL: "",
        },
      },
    );

    return result.modifiedCount;
  } catch (error) {
    throw error;
  }
};
