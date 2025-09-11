import mongoose, { Schema, Document } from "mongoose";

export enum FileStatus {
  PENDING = "PENDING",
  UPLOADED_TO_SLACK = "UPLOADED_TO_SLACK",
  FAILED = "FAILED",
}

export interface IFile extends Document {
  fileName: string;
  blobURL: string;
  fileSize: number;
  uploadSessionID: string;
  userID: mongoose.Types.ObjectId;
  workspaceID: mongoose.Types.ObjectId;
  fileType: string;
  status: FileStatus;
  slackFileURL?: string;
  slackFileID?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

const FileSchema = new Schema<IFile>(
  {
    fileName: { type: String, required: true },
    blobURL: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadSessionID: { type: String, required: true, index: true },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workspaceID: {
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
    slackFileURL: { type: String },
    slackFileID: { type: String },
    errorMessage: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const File =
  mongoose.models.File || mongoose.model<IFile>("File", FileSchema);
