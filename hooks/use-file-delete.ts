"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/hooks/use-toast-mutation";
import { useDrawerStore } from "@/stores/drawer-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useFileStore } from "@/stores/file-store";

type DeleteFlag = "app" | "both";

interface DeleteFilesParams {
  fileIDs: string[];
  deleteFlag: DeleteFlag;
}

export function useFileDelete() {
  const queryClient = useQueryClient();

  const deleteFiles = useFileStore((state) => state.deleteFiles);

  const selectedFiles = useSelectionStore((state) => state.selectedFiles);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const setSelectMode = useSelectionStore((state) => state.setSelectMode);

  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const deleteMutation = useToastMutation(
    {
      mutationFn: async ({ fileIDs, deleteFlag }: DeleteFilesParams) => {
        await deleteFiles(fileIDs, deleteFlag);

        return { count: fileIDs.length };
      },
      toast: {
        onSuccess: {
          title: "Delete Complete",
          description: (data: unknown) => {
            const result = data as { count: number };

            return `Successfully deleted ${result.count} file${result.count !== 1 ? "s" : ""}`;
          },
          status: "success",
        },
        onError: {
          title: "Delete Failed",
          description: (error) =>
            error instanceof Error
              ? error.message
              : "An error occurred while deleting files",
          status: "error",
        },
      },
      onSuccess: async () => {
        clearSelection();
        setSelectMode(false);
        closeDrawer();

        queryClient.invalidateQueries({ queryKey: ["files"] });
      },
    },
    ["deleteFiles"],
  );

  const performDelete = async (deleteFlag: DeleteFlag) => {
    if (selectedFiles.length <= 0) return;

    const fileIDs = selectedFiles.map((file) => file.fileID);

    deleteMutation.mutate({ fileIDs, deleteFlag });
  };

  return {
    isDeleting: deleteMutation.isPending,
    performDelete,
  };
}
