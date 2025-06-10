export interface FileItem {
  fileID: string;
  name: string;
  fileType: string;
  uploadDate: string;
  fileSize: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
}

export interface FileMetadata extends FileItem {
  createdBy: string;
  channel: string;
  exif?: {
    camera?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
    shutterSpeed?: string;
  };
  documentInfo?: {
    pageCount?: number;
    author?: string;
    creationDate?: string;
  };
  videoInfo?: {
    duration?: number;
    resolution?: string;
    codec?: string;
  };
}

export interface FileServiceInterface {
  fetchFiles(
    page: number | string,
    limit: number,
    fileTypes?: string[],
  ): Promise<FetchFilesResponse>;

  deleteFiles(
    files: { fileID: string; deleteFlag: "app" | "both" }[],
  ): Promise<boolean>;

  downloadSingleFile(file: {
    fileID: string;
    name: string;
    url: string;
  }): Promise<boolean>;

  downloadMultipleFiles(
    files: { fileID: string; name: string; url: string }[],
  ): Promise<boolean>;
}

export interface FetchFilesResponse {
  files: FileItem[];
  nextCursor?: string | number;
  hasMore: boolean;
}
