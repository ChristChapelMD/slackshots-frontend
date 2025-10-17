import mongoose from "mongoose";

import { Workspace, WorkspaceDTO } from "../models/workspace.model";

import dbConnect from "@/services/api/db/connection";

export async function createOrUpdateWorkspace(
  data: WorkspaceDTO,
): Promise<WorkspaceDTO | null> {
  await dbConnect();

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

export async function getWorkspaceBySlackId(
  slackWorkspaceId: string,
  includeSensitive: boolean = false,
): Promise<Partial<WorkspaceDTO> & { _id: mongoose.Types.ObjectId }> {
  await dbConnect();

  try {
    const projection = includeSensitive ? {} : { botToken: 0 };
    const workspace = await Workspace.findOne(
      { workspaceId: slackWorkspaceId },
      projection,
    ).lean<WorkspaceDTO & { _id: mongoose.Types.ObjectId }>();

    if (!workspace) {
      throw new Error(`Workspace with Slack ID ${slackWorkspaceId} not found.`);
    }

    return workspace;
  } catch (error) {
    console.error("Failed to get workspace by Slack ID:", error);
    throw new Error("Workspace retrieval by Slack ID failed");
  }
}

export async function getWorkspaceByDocumentId(
  documentId: string | mongoose.Types.ObjectId,
  includeSensitive: boolean = false,
): Promise<Partial<WorkspaceDTO> & { _id: mongoose.Types.ObjectId }> {
  await dbConnect();

  try {
    const projection = includeSensitive ? {} : { botToken: 0 };
    const workspace = await Workspace.findById(documentId, projection).lean<
      WorkspaceDTO & { _id: mongoose.Types.ObjectId }
    >();

    if (!workspace) {
      throw new Error(`Workspace with document ID ${documentId} not found.`);
    }

    return workspace;
  } catch (error) {
    console.error("Failed to get workspace by document ID:", error);
    throw new Error("Workspace retrieval by document ID failed");
  }
}

export async function listAllWorkspaces(): Promise<Array<WorkspaceDTO | null>> {
  await dbConnect();

  try {
    return await Workspace.find({}).lean<WorkspaceDTO[]>();
  } catch (error) {
    console.error("Failed to list workspaces:", error);
    throw new Error("Workspace listing failed");
  }
}
