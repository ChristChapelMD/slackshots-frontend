import { Workspace, WorkspaceDTO } from "../models/workspace.model";

export async function createOrUpdateWorkspace(
  data: WorkspaceDTO,
): Promise<WorkspaceDTO | null> {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { workspaceId: data.workspaceId },
      { $set: data },
      { new: true, upsert: true },
    ).lean<WorkspaceDTO>();

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

export async function listAllWorkspaces(): Promise<Array<WorkspaceDTO | null>> {
  try {
    return await Workspace.find({}).lean<WorkspaceDTO[]>();
  } catch (error) {
    console.error("Failed to list workspaces:", error);
    throw new Error("Workspace listing failed");
  }
}
