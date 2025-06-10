"use client";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCallback, useState, useEffect, useRef } from "react";

import { useFileStore } from "@/stores/file-store";
import { services } from "@/services/api";
import { useUploadProcessStore } from "@/stores/upload-process-store";

const STALE_TIME = 1000 * 60 * 5;
const POST_UPLOAD_STALE_TIME = 1000 * 5;

export function useFiles(
  options: {
    pageSize?: number;
    fileTypes?: string[];
    loadMore?: boolean;
  } = {},
) {
  const queryClient = useQueryClient();
  const { pageSize = 16, fileTypes = [] } = options;

  const fileStoreRef = useRef(useFileStore.getState());

  useEffect(() => {
    return useFileStore.subscribe((state) => {
      fileStoreRef.current = state;
    });
  }, []);

  const isLoading = useFileStore((state) => state.isLoading);
  const files = useFileStore((state) => state.files);
  const hasMore = useFileStore((state) => state.hasMore);
  const lastUploadTimestamp = useUploadProcessStore(
    (state) => state.lastUploadTimestamp,
  );

  const [queryState, setQueryState] = useState({
    page: 1,
    loadMore: false,
    enabled: false,
  });

  const recentUpload =
    Date.now() - lastUploadTimestamp < POST_UPLOAD_STALE_TIME;

  const query = useQuery({
    queryKey: [
      "files",
      {
        page: queryState.page,
        pageSize,
        fileTypes,
        recentUpload,
      },
    ],
    queryFn: async () => {
      return services.file.fetchFiles(queryState.page, pageSize, fileTypes);
    },
    enabled: queryState.enabled,
    staleTime: recentUpload ? POST_UPLOAD_STALE_TIME : STALE_TIME,
    retry: recentUpload ? 5 : 3,
    retryDelay: (attemptIndex) => {
      const baseDelay = recentUpload ? 500 : 1000;
      const multiplier = recentUpload ? 2 : 3;
      const maxDelay = recentUpload ? 8000 : 20000;

      return Math.min(baseDelay * Math.pow(multiplier, attemptIndex), maxDelay);
    },
    refetchInterval: recentUpload ? 3000 : false,
  });

  useEffect(() => {
    if (!queryState.enabled) return;

    if (query.isLoading || query.isFetching) {
      useFileStore.setState({ isLoading: true });
    }

    if (query.isSuccess && query.data) {
      useFileStore.setState((state) => {
        let updatedFiles = queryState.loadMore ? [...state.files] : [];

        if (queryState.loadMore) {
          const existingIds = new Set(updatedFiles.map((file) => file.fileID));

          const newFilesToAdd = query.data.files.filter(
            (file) => !existingIds.has(file.fileID),
          );

          updatedFiles = [...updatedFiles, ...newFilesToAdd];
        } else {
          updatedFiles = query.data.files;
        }

        return {
          files: updatedFiles,
          hasMore: query.data.hasMore,
          isLoading: false,
          nextPage: queryState.loadMore ? state.nextPage + 1 : 2,
        };
      });
    }

    if (query.isError) {
      useFileStore.setState({ isLoading: false });
    }
  }, [
    query.data,
    query.isLoading,
    query.isSuccess,
    query.isError,
    query.isFetching,
    queryState.enabled,
    queryState.loadMore,
  ]);

  const loadFiles = useCallback((loadMore = false) => {
    const page = loadMore ? fileStoreRef.current.nextPage : 1;

    setQueryState({
      page,
      loadMore,
      enabled: true,
    });
  }, []);

  useEffect(() => {
    const entry = { queryClient, loadFiles };

    activeQueryClients.push(entry);

    return () => {
      const index = activeQueryClients.indexOf(entry);

      if (index !== -1) {
        activeQueryClients.splice(index, 1);
      }
    };
  }, [queryClient, loadFiles]);

  return {
    isLoading,
    files,
    hasMore,
    loadFiles,
    error: query.error,
  };
}

let activeQueryClients: Array<{
  queryClient: any;
  loadFiles: (loadMore: boolean) => void;
}> = [];

export function refreshFilesAfterUpload() {
  activeQueryClients.forEach(({ queryClient, loadFiles }) => {
    queryClient.invalidateQueries({ queryKey: ["files"] });
    loadFiles(false);
  });
}
