import mongoose from "mongoose";

import { File, FileRecordStatus, FileRecordDTO } from "../models/file.model";

export type FileUpdateDetails = {
  slackFileId?: string;
  slackFileUrl?: string;
  errorMessage?: string;
  aiTags?: string[];
  moderationFlag?: boolean;
};

export async function createFileRecord(data: FileRecordDTO) {
  const file = new File({
    ...data,
    status: FileRecordStatus.PENDING,
  });

  return await file.save();
}

export async function updateFileRecord(
  fileId: mongoose.Types.ObjectId,
  status: FileRecordStatus,
  details: FileUpdateDetails = {},
) {
  return await File.findByIdAndUpdate(
    fileId,
    { status, ...details },
    { new: true },
  );
}

export async function getPendingFilesBySession(uploadSessionID: string) {
  return await File.find({
    uploadSessionID,
    status: FileRecordStatus.PENDING,
  }).sort({
    createdAt: 1,
  });
}

export async function getFailedFilesBySession(uploadSessionID: string) {
  return await File.find({
    uploadSessionID,
    status: FileRecordStatus.FAILED,
  }).sort({
    createdAt: 1,
  });
}

export async function getFilesForUser(
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 16,
) {
  return await File.find({ userId, status: FileRecordStatus.UPLOADED_TO_SLACK })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function getFilesForWorkspace(
  workspaceId: string,
  page: number = 1,
  limit: number = 16,
) {
  return await File.find({
    workspaceId,
    status: FileRecordStatus.UPLOADED_TO_SLACK,
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function markFileAsFailed(
  fileId: mongoose.Types.ObjectId,
  errorMessage?: string,
) {
  return await updateFileRecord(fileId, FileRecordStatus.FAILED, {
    errorMessage,
  });
}

export async function bulkUpdateFilesStatus(
  fileIds: mongoose.Types.ObjectId[],
  status: FileRecordStatus,
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
