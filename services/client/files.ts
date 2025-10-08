import {
  FileItem,
  FetchFilesResponse,
} from "@/types/service-types/file-service";

export async function fetchFiles(
  page: number,
  limit: number,
  fileTypes?: string[],
): Promise<FetchFilesResponse> {
  let queryParams = `page=${page}&limit=${limit}`;

  if (fileTypes && fileTypes.length > 0) {
    queryParams += `&fileTypes=${fileTypes.join(",")}`;
  }

  const response = await fetch(`/api/files?${queryParams}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(data.message || "Failed to fetch files");
  }

  const data = await response.json();

  return {
    files: data.files || [],
    hasMore: data.files?.length > 0,
  };
}

export async function deleteFiles(
  files: { fileID: string; deleteFlag: "app" | "both" }[],
): Promise<boolean> {
  if (!files || files.length === 0) {
    throw new Error("No files selected to delete.");
  }

  const response = await fetch("/api/files", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ files }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(data.message || `Failed to delete files`);
  }

  return true;
}

export async function downloadSingleFile(file: FileItem): Promise<void> {
  const providerFileId = file.uploads?.[0]?.providerFileId;

  if (!providerFileId) throw new Error("Invalid file or missing provider ID");

  const response = await fetch(`/api/files/${providerFileId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = objectUrl;
  a.download = file.fileName || `file-${file._id}`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }, 100);
}

export async function downloadMultipleFiles(files: FileItem[]): Promise<void> {
  if (!files || files.length === 0)
    throw new Error("No files selected to download");

  const response = await fetch("/api/files/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ files }),
  });

  if (!response.ok)
    throw new Error(`Failed to download files: ${response.status}`);

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
}
