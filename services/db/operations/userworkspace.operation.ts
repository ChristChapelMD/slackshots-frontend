import { UserWorkspace } from "../models/userworkspace.model";

import { WorkspaceDTO } from "./workspace.operation";

type RoleEnum = "member" | "owner";

export interface UserWorkspaceDTO {
  workspaceId: string;
  userId: string;
  role: RoleEnum;
}

export async function createOrUpdateUserWorkspaceRelation(
  userId: string,
  workspaceId: string,
  role: RoleEnum = "member",
): Promise<UserWorkspaceDTO | null> {
  try {
    const userWorkspace = await UserWorkspace.findOneAndUpdate(
      { workspaceId, userId },
      { $set: { workspaceId, userId, role } },
      { new: true, upsert: true },
    ).lean<UserWorkspaceDTO>();

    return userWorkspace;
  } catch (error) {
    console.error("Failed to create or update user-workspace relation:", error);
    throw new Error("User-Workspace Relation creation/update failed");
  }
}

export async function getUserWorkspaceRelation(
  userId: string,
  workspaceId: string,
): Promise<UserWorkspaceDTO | null> {
  try {
    const userWorkspace = await UserWorkspace.findOne({
      userId,
      workspaceId,
    }).lean<UserWorkspaceDTO>();

    return userWorkspace;
  } catch (error) {
    console.error("Failed to get user-workspace relation:", error);
    throw new Error("User-Workspace Relation retrieval failed");
  }
}

export async function getAllUserWorkspaces(
  userId: string,
): Promise<(WorkspaceDTO & { role: RoleEnum })[]> {
  try {
    const workspacesWithRoles = await UserWorkspace.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "workspace",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "workspace",
        },
      },
      { $unwind: "$workspace" },
      {
        $project: {
          workspaceId: "$workspace.workspaceId",
          name: "$workspace.name",
          botToken: "$workspace.botToken",
          botUserId: "$workspace.botUserId",
          scope: "$workspace.scope",
          role: "$role",
        },
      },
    ]);

    return workspacesWithRoles as (WorkspaceDTO & { role: RoleEnum })[];
  } catch (error) {
    console.error("Failed to get all user-workspace relations:", error);
    throw new Error("All User-Workspace Relation retrieval failed");
  }
}

export async function removeUserFromWorkspace(
  userId: string,
  workspaceId: string,
): Promise<void> {
  try {
    await UserWorkspace.deleteOne({
      userId,
      workspaceId,
    });
  } catch (error) {
    console.error("Failed to remove user from workspace:", error);
    throw new Error("User-Workspace Relation removal failed");
  }
}
