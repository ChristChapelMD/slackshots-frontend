"use client";

import { useState } from "react";

import { FileItem } from "@/types/service-types/file-service";
import { useToastMutation } from "@/hooks/use-toast-mutation";
import { useSelectionStore } from "@/stores/selection-store";
import { client } from "@/services/client";

export function useFileDownload() {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const selectedFiles = useSelectionStore((state) => state.selectedFiles);

  const bulkDownloadMutation = useToastMutation(
    {
      mutationFn: async () => {
        if (selectedFiles.length === 0) {
          throw new Error("No files selected for download");
        }

        if (selectedFiles.length === 1) {
          await client.files.downloadSingleFile(selectedFiles[0]);

          return { count: 1 };
        }

        await client.files.downloadMultipleFiles(selectedFiles);

        return { count: selectedFiles.length };
      },
      toast: {
        onSuccess: {
          title: "Files Downloaded",
          description: (data: unknown) => {
            const result = data as { count: number };

            return `Successfully downloaded ${result.count} file${result.count !== 1 ? "s" : ""}`;
          },
          status: "success",
        },
        onError: {
          title: "Download Failed",
          description: (error) =>
            error instanceof Error ? error.message : "Failed to download files",
          status: "error",
        },
      },
    },
    ["downloadFiles"],
  );

  const singleFileMutation = useToastMutation(
    {
      mutationFn: async (file: FileItem) => {
        setDownloadingFile(file._id);
        try {
          await client.files.downloadSingleFile(file);

          return { fileName: file.fileName };
        } finally {
          setDownloadingFile(null);
        }
      },
      toast: {
        onSuccess: {
          title: "File Downloaded",
          description: (data: unknown) => {
            const result = data as { count: number };

            return `Successfully started downloading ${result.count} file${result.count !== 1 ? "s" : ""}`;
          },
          status: "success",
        },
        onError: {
          title: "Download Failed",
          description: (error) =>
            error instanceof Error ? error.message : "Failed to download file",
          status: "error",
        },
      },
    },
    ["downloadSingleFile"],
  );

  return {
    isDownloading: bulkDownloadMutation.isPending,
    downloadSelectedFiles: () => bulkDownloadMutation.mutate(),

    downloadSingleFile: (file: FileItem) => singleFileMutation.mutate(file),
    isSingleFileDownloading: singleFileMutation.isPending || !!downloadingFile,
    isFileDownloading: (fileID: string) =>
      downloadingFile === fileID ||
      (singleFileMutation.isPending &&
        singleFileMutation.variables?._id === fileID),
  };
}
