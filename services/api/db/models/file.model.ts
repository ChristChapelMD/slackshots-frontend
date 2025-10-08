import mongoose, { Schema, Document } from "mongoose";

export enum FileRecordStatus {
  PENDING = "PENDING",
  UPLOADED = "UPLOADED",
  FAILED = "FAILED",
}

export interface FileRecordDTO {
  fileName: string;
  fileSize: number;
  uploadSessionId: string;
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  fileType: string;
  status: FileRecordStatus;
  uploads: {
    provider: string;
    providerFileId: string;
    providerFileUrl: string;
  }[];
  errorMessage?: string;
  metadata?: Record<string, any>;
}

interface IFileRecord extends FileRecordDTO, Document {}

const FileRecordSchema = new Schema<IFileRecord>(
  {
    fileName: { type: String, required: true },
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
      default: FileRecordStatus.UPLOADED,
      required: true,
    },
    uploads: [
      {
        provider: { type: String, required: true, enum: ["slack"] },
        providerFileId: { type: String, required: true },
        providerFileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    errorMessage: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const File =
  mongoose.models.File || mongoose.model<IFileRecord>("File", FileRecordSchema);
