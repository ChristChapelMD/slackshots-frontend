import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { FileItem } from "@/types/service-types/file-service";
import { services } from "@/services/api";

interface FileStore {
  files: FileItem[];
  isLoading: boolean;
  hasMore: boolean;
  nextPage: number;
  prioritizedFileIds: string[];
  setPrioritizedFileIds: (ids: string[]) => void;
  loadFiles: (
    loadMore?: boolean,
    fileTypes?: string[],
    pageSize?: number,
  ) => Promise<void>;
  deleteFiles: (ids: string[], deleteFlag: "app" | "both") => Promise<void>;
}

export const useFileStore = create<FileStore>()(
  devtools((set, get) => {
    return {
      files: [],
      isLoading: false,
      hasMore: true,
      nextPage: 1,
      prioritizedFileIds: [],

      setPrioritizedFileIds: (ids) => set({ prioritizedFileIds: ids }),

      loadFiles: async (loadMore = false, fileTypes = [], pageSize = 16) => {
        set({ isLoading: true });

        try {
          const { files, nextPage } = get();
          const page = loadMore ? nextPage : 1;

          const result = await services.file.fetchFiles(
            page,
            pageSize,
            fileTypes,
          );

          set({
            files: loadMore ? [...files, ...result.files] : result.files,
            hasMore: result.hasMore,
            isLoading: false,
            nextPage: loadMore ? nextPage + 1 : 2,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteFiles: async (fileIDs, deleteFlag) => {
        try {
          await services.file.deleteFiles(
            fileIDs.map((fileID) => ({ fileID, deleteFlag })),
          );

          set((state) => ({
            files: state.files.filter((file) => !fileIDs.includes(file.fileID)),
          }));
        } catch (error) {
          throw error;
        }
      },
    };
  }),
);
