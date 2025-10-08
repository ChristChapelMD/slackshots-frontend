import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FileUIStore {
  prioritizedFileIds: string[];
  setPrioritizedFileIds: (ids: string[]) => void;
}

export const useFileUIStore = create<FileUIStore>()(
  devtools((set) => {
    return {
      prioritizedFileIds: [],
      setPrioritizedFileIds: (ids) => set({ prioritizedFileIds: ids }),
    };
  }),
);
