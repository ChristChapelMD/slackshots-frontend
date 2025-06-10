import { create } from "zustand";

interface UploadFormState {
  files: FileList | null;
  channel: string;
  comment: string;
  messageBatchSize: number;
  fileTypes: string[];
  sessionId: string;
  fileSelection: string;
}

interface UploadFormStore {
  formState: UploadFormState;
  updateForm: (update: Partial<UploadFormState>) => void;
  setFiles: (files: FileList | null) => void;
  setFileSelection: (selection: string) => void;
  resetForm: () => void;
}

const initialState: UploadFormState = {
  files: null,
  channel: "",
  comment: "",
  messageBatchSize: 10,
  fileTypes: [".jpg", ".jpeg", ".png"],
  sessionId: "",
  fileSelection: "",
};

export const useUploadFormStore = create<UploadFormStore>((set) => ({
  formState: initialState,

  updateForm: (update) =>
    set((state) => ({
      formState: { ...state.formState, ...update },
    })),

  setFiles: (files) =>
    set((state) => ({
      formState: { ...state.formState, files },
    })),

  setFileSelection: (fileSelection) =>
    set((state) => ({
      formState: { ...state.formState, fileSelection },
    })),

  resetForm: () =>
    set({ formState: { ...initialState, sessionId: crypto.randomUUID() } }),
}));
