import mongoose, { Schema, Document } from "mongoose";

interface IWorkspace extends Document {
  workspaceId: string;
  workspaceName: string;
  botToken: string;
  botUserId: string;
  scope: string;
  enterpriseId?: string;
  enterpriseName?: string;
}

export type WorkspaceDTO = Omit<IWorkspace, "_id" | "createdAt" | "updatedAt">;

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    workspaceId: { type: String, required: true, unique: true },
    workspaceName: { type: String, required: true },
    botToken: { type: String, required: true },
    botUserId: { type: String, required: true },
    scope: { type: String, required: true },
    enterpriseId: { type: String },
    enterpriseName: { type: String },
  },
  { timestamps: true },
);

export const Workspace =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
