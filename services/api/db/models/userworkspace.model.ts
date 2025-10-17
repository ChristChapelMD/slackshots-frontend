import mongoose, { Schema, Document } from "mongoose";

type RoleEnum = "owner" | "member";

export interface UserWorkspaceDTO {
  workspaceId: string;
  userId: string;
  role: RoleEnum;
}

interface IUserWorkspace extends UserWorkspaceDTO, Document {}

const UserWorkspaceSchema = new Schema<IUserWorkspace>(
  {
    workspaceId: { type: String, required: true },
    userId: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "member"],
      required: true,
      default: "member",
    },
  },
  { timestamps: true },
);

UserWorkspaceSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export const UserWorkspace =
  mongoose.models.UserWorkspace ||
  mongoose.model<IUserWorkspace>("UserWorkspace", UserWorkspaceSchema);
