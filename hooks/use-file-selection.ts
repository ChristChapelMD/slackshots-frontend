import { useFileStore } from "@/stores/file-store";
import { useSelectionStore } from "@/stores/selection-store";

export function useFileSelection() {
  const files = useFileStore((state) => state.files);
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
    const filesToSelect = files.filter((file) => ids.includes(file.fileID));

    setSelectedFiles(filesToSelect);
  };

  const selectByFileType = (fileType: string) => {
    const filesToSelect = files.filter((file) =>
      file.name.toLowerCase().endsWith(fileType.toLowerCase()),
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
