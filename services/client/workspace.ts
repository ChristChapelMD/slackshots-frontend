import { WorkspaceDTO } from "@/services/db/models/workspace.model";

export async function fetchCurrentWorkspace(): Promise<WorkspaceDTO> {
  const response = await fetch("/api/workspace/current", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current workspace");
  }

  const data: WorkspaceDTO = await response.json();

  return data;
}

export async function addWorkspace(): Promise<{
  success: boolean;
  url?: string;
  error?: Error;
}> {
  const response = await fetch("/api/workspace/add", {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error("Failed to start OAuth");
  }

  return { success: true, url: data.url };
}
