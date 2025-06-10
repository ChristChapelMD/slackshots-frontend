import { APIService } from "../api-service";

import {
  FileServiceInterface,
  FetchFilesResponse,
} from "@/types/service-types/file-service";

export class FileService extends APIService implements FileServiceInterface {
  async fetchFiles(
    page: number | string,
    limit: number,
    fileTypes?: string[],
  ): Promise<FetchFilesResponse> {
    try {
      let queryParams = `page=${page}&limit=${limit}`;

      if (fileTypes && fileTypes.length > 0) {
        queryParams += `&fileTypes=${fileTypes.join(",")}`;
      }

      const response = await this.fetchWithAuth(`getImagesUrls?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      return {
        files: data.imageUrls || [],
        nextCursor:
          data.nextCursor ||
          (data.hasMore
            ? typeof page === "number"
              ? page + 1
              : page
            : undefined),
        hasMore: !!data.hasMore,
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while fetching files");
    }
  }

  async deleteFiles(
    files: { fileID: string; deleteFlag: "app" | "both" }[],
  ): Promise<boolean> {
    try {
      if (!files || files.length === 0) {
        throw new Error("No files selected to delete.");
      }

      const transformedFiles = files.map((item) => ({
        id: item.fileID,
        deleteFlag: item.deleteFlag,
      }));

      const response = await this.fetchWithAuth("deleteFiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: transformedFiles }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message || `API responded with status: ${response.status}`,
        );
      }

      return true;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while deleting files");
    }
  }

  async downloadSingleFile(file: {
    fileID: string;
    name: string;
    url: string;
  }): Promise<boolean> {
    if (!file || !file.url) {
      throw new Error("Invalid file or missing URL");
    }

    try {
      const response = await fetch(file.url, {
        headers: {
          ...(APIService.accessToken
            ? {
                Authorization: `Bearer ${APIService.accessToken}`,
              }
            : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = objectUrl;
      a.download = file.name || `file-${file.fileID}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      }, 100);

      return true;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while downloading a file");
    }
  }

  async downloadMultipleFiles(
    files: { fileID: string; name: string; url: string }[],
  ): Promise<boolean> {
    if (!files || files.length === 0) {
      throw new Error("No files selected to download");
    }

    try {
      const filesForDownload = files.map((file) => ({
        url: file.url,
        name: file.name,
      }));

      const response = await this.fetchWithAuth("downloadFiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesForDownload }),
      });

      if (!response.ok) {
        throw new Error(`Failed to download files: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `ss_files_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      return true;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while downloading multipple files");
    }
  }
}
