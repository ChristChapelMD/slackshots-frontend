import mongoose, { Schema, Document } from "mongoose";

export enum FileStatus {
  PENDING = "PENDING",
  UPLOADED_TO_SLACK = "UPLOADED_TO_SLACK",
  FAILED = "FAILED",
}

export interface IFile extends Document {
  fileName: string;
  blobUrl: string;
  fileSize: number;
  uploadSessionId: string;
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  fileType: string;
  status: FileStatus;
  slackFileUrl?: string;
  slackFileId?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

const FileSchema = new Schema<IFile>(
  {
    fileName: { type: String, required: true },
    blobUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadSessionId: { type: String, required: true, index: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    fileType: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(FileStatus),
      default: FileStatus.PENDING,
      required: true,
    },
    slackFileUrl: { type: String },
    slackFileId: { type: String },
    errorMessage: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const File =
  mongoose.models.File || mongoose.model<IFile>("File", FileSchema);
