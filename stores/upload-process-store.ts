import { create } from "zustand";

interface UploadProcessState {
  isUploading: boolean;
  uploadProgress: number;
  lastUploadTimestamp: number;
  setUploading: (isUploading: boolean) => void;
  setProgress: (progress: number) => void;
  setLastUploadTimestamp: (timestamp: number) => void;
}

export const useUploadProcessStore = create<UploadProcessState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  lastUploadTimestamp: 0,

  setUploading: (isUploading) => set({ isUploading }),
  setProgress: (uploadProgress) => set({ uploadProgress }),
  setLastUploadTimestamp: (lastUploadTimestamp) => set({ lastUploadTimestamp }),
}));
