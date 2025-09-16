import { create } from "zustand";

import { useUploadFormStore } from "./upload-form-store";

import { client } from "@/services/client";

interface UploadProcessState {
  isUploading: boolean;
  uploadProgress: number;
  lastUploadTimestamp: number;
  startUpload: () => Promise<void>;
  clearUpload: () => void;
}

export const useUploadProcessStore = create<UploadProcessState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  lastUploadTimestamp: 0,

  startUpload: async () => {
    const formState = useUploadFormStore.getState().formState;
    const resetForm = useUploadFormStore.getState().resetForm;

    if (!formState.files || !formState.channel) return;

    const sessionId = crypto.randomUUID();

    useUploadFormStore.getState().updateForm({ sessionId });

    set({
      isUploading: true,
      uploadProgress: 0,
    });

    try {
      await client.upload.uploadFiles({
        files: formState.files,
        channel: formState.channel,
        comment: formState.comment,
        messageBatchSize: formState.messageBatchSize,
        sessionId,
        onProgress: (progress) => {
          set({ uploadProgress: progress });
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 800));

      set({ lastUploadTimestamp: Date.now() });

      const { refreshFilesAfterUpload } = require("@/hooks/use-files");

      refreshFilesAfterUpload();

      set({
        isUploading: false,
        uploadProgress: 0,
      });

      resetForm();
    } catch (error) {
      set({
        isUploading: false,
        lastUploadTimestamp: Date.now(),
      });
      throw error;
    }
  },

  clearUpload: () => {
    set({
      uploadProgress: 0,
      lastUploadTimestamp: Date.now(),
    });
    useUploadFormStore.getState().resetForm();
  },
}));
