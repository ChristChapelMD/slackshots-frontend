import { FileItem } from "@/types/service-types/file-service";
import { useSelectionStore } from "@/stores/selection-store";

export function useFileSelection(files: FileItem[]) {
  const setSelectMode = useSelectionStore((state) => state.setSelectMode);
  const setSelectedFiles = useSelectionStore((state) => state.setSelectedFiles);
  const isSelectMode = useSelectionStore((state) => state.isSelectMode);

  const selectAllFiles = () => {
    if (!isSelectMode) {
      setSelectMode(true);
    }
    setSelectedFiles(files);
  };

  const selectFilesByIds = (ids: string[]) => {
    const filesToSelect = files.filter((file) => ids.includes(file._id));

    setSelectedFiles(filesToSelect);
  };

  const selectByFileType = (fileType: string) => {
    const filesToSelect = files.filter((file) =>
      file.fileName.toLowerCase().endsWith(fileType.toLowerCase()),
    );

    if (!isSelectMode) {
      setSelectMode(true);
    }
    setSelectedFiles(filesToSelect);
  };

  return {
    selectAllFiles,
    selectFilesByIds,
    selectByFileType,
  };
}
