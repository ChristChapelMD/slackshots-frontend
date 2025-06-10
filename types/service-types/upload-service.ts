export interface UploadFile {
  file: File;
  progress: number;
  status: "queued" | "uploading" | "completed" | "error";
  error?: string;
}

export interface UploadOptions {
  files: FileList | null;
  channel: string;
  comment: string;
  messageBatchSize: number;
  sessionId: string;
  onProgress?: (overallProgress: number) => void;
}

export interface UploadServiceInterface {
  uploadFiles(options: UploadOptions): Promise<boolean>;
}
