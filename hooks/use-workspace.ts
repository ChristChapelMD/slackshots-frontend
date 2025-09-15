"use client";

import { useState, useCallback } from "react";

import { WorkspaceDTO as Workspace } from "@/services/db/models/workspace.model";

export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<Error | null>(null);

  const addWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workspace/add", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.url) throw new Error("Failed to start OAuth");

      localStorage.setItem("workspacePending", "true");

      window.location.href = data.url;

      return { success: true };
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error("Unknown error");

      setError(e);

      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentWorkspace = useCallback(async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);

    try {
      const response = await fetch("/api/workspace/current");

      if (!response.ok) throw new Error("Failed to fetch current workspace");

      const data: Workspace = await response.json();

      setCurrentWorkspace(data);
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error("Unknown error");

      setWorkspaceError(e);
      setCurrentWorkspace(null);
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addWorkspace,
    currentWorkspace,
    workspaceLoading,
    workspaceError,
    fetchCurrentWorkspace,
  };
}
