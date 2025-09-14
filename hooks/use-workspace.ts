"use client";

import { useState, useCallback } from "react";

export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workspace/add", { method: "POST" });

      const data = await response.json();

      if (!response.ok || !data.url) throw new Error("Failed to start OAuth");

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

  return {
    loading,
    error,
    addWorkspace,
  };
}
