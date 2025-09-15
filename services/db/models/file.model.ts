import mongoose, { Schema, Document } from "mongoose";

export enum FileRecordStatus {
  PENDING = "PENDING",
  UPLOADED_TO_SLACK = "UPLOADED_TO_SLACK",
  FAILED = "FAILED",
}

interface IFileRecord extends Document {
  fileName: string;
  blobUrl: string;
  fileSize: number;
  uploadSessionId: string;
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  fileType: string;
  status: FileRecordStatus;
  slackFileUrl?: string;
  slackFileId?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export type FileRecordDTO = Omit<
  IFileRecord,
  "_id" | "createdAt" | "updatedAt"
>;

const FileRecordSchema = new Schema<IFileRecord>(
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
      enum: Object.values(FileRecordStatus),
      default: FileRecordStatus.PENDING,
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
  mongoose.models.File || mongoose.model<IFileRecord>("File", FileRecordSchema);
