import { Workspace } from "../models/workspace.model";

export interface WorkspaceDTO {
  workspaceId: string;
  name: string;
  botToken: string;
  botUserId: string;
  scope: string;
}

export async function createOrUpdateWorkspace(data: WorkspaceDTO) {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $set: data },
      { new: true, upsert: true },
    ).lean();

    return workspace;
  } catch (error) {
    console.error("Failed to create or update workspace:", error);
    throw new Error("Workspace creation/update failed");
  }
}

export async function getWorkspaceById(
  workspaceId: string,
): Promise<WorkspaceDTO> {
  try {
    const workspace = await Workspace.findOne({
      workspaceId,
    }).lean<WorkspaceDTO>();

    if (!workspace) {
      throw new Error(`Workspace with ID ${workspaceId} not found.`);
    }

    return workspace;
  } catch (error) {
    console.error("Failed to get workspace:", error);
    throw new Error("Workspace retrieval failed");
  }
}

export async function listAllWorkspaces() {
  try {
    return await Workspace.find({}).lean();
  } catch (error) {
    console.error("Failed to list workspaces:", error);
    throw new Error("Workspace listing failed");
  }
}
