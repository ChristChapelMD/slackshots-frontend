import type { FileItem } from "@/types/service-types/file-service";

import { create } from "zustand";

interface SelectionStore {
  isSelectMode: boolean;
  selectedFiles: FileItem[];
  setSelectedFiles: (files: FileItem[]) => void;
  setSelectMode: (selectMode: boolean) => void;
  toggleSelectMode: () => void;
  toggleFileSelection: (file: FileItem) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  isSelectMode: false,
  selectedFiles: [],

  setSelectedFiles: (files) => set({ selectedFiles: files }),

  setSelectMode: (selectMode) => set({ isSelectMode: selectMode }),

  toggleSelectMode: () =>
    set((state) => ({
      isSelectMode: !state.isSelectMode,
      selectedFiles: !state.isSelectMode ? [] : state.selectedFiles,
    })),

  toggleFileSelection: (file) =>
    set((state) => {
      if (!state.isSelectMode) return state;

      const isSelected = state.selectedFiles.some(
        (selectedFile) => selectedFile.fileID === file.fileID,
      );

      return {
        selectedFiles: isSelected
          ? state.selectedFiles.filter(
              (selectedFile) => selectedFile.fileID !== file.fileID,
            )
          : [...state.selectedFiles, file],
      };
    }),

  clearSelection: () => set({ selectedFiles: [] }),
}));
