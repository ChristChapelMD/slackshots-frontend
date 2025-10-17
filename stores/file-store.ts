import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FileStore {
  prioritizedFileIds: string[];
  setPrioritizedFileIds: (ids: string[]) => void;
}

export const useFileStore = create<FileStore>()(
  devtools((set) => {
    return {
      prioritizedFileIds: [],
      setPrioritizedFileIds: (ids) => set({ prioritizedFileIds: ids }),
    };
  }),
);
