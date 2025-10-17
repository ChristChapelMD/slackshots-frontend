"use client";

import { Button, ButtonGroup } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { SelectModeActionIcons } from "@/components/dashboard/header/select-mode/select-mode-button-icons";
import { TextureContainer } from "@/components/ui/texture-container";
import { useFiles } from "@/hooks/use-files";
import { useDrawerStore } from "@/stores/drawer-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useFileSelection } from "@/hooks/use-file-selection";
import { useFileDownload } from "@/hooks/use-file-download";
import { DeleteDrawer } from "@/components/drawers/dashboard/delete-drawer";
import { useUploadProcessStore } from "@/stores/upload-process-store";

const { selectAll, clearSelected, downloadSelected, deleteSelected } =
  SelectModeActionIcons;

export function SelectActionButtons({ ltr }: { ltr?: boolean }) {
  const isSelectMode = useSelectionStore((state) => state.isSelectMode);
  const selectedFiles = useSelectionStore((state) => state.selectedFiles);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const drawerId = useDrawerStore((state) => state.drawerId);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const { files } = useFiles();
  const { selectAllFiles } = useFileSelection(files);
  const { isDownloading, downloadSelectedFiles } = useFileDownload();

  const isDeletDrawerOpen = isOpen && drawerId === "delete";

  const lastClickedRef = useRef(0);

  const handleToggleDelete = () => {
    const now = Date.now();

    if (now - lastClickedRef.current < 500 || isAnimating) return;
    lastClickedRef.current = now;

    if (isDeletDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer("delete", <DeleteDrawer />, {
        title: `Delete ${selectedFiles.length} selected files?`,
        placement: "bottom",
        size: "lg",
        backdrop: "blur",
      });
    }
  };

  const xOffset = ltr ? -20 : 20;

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  return (
    <AnimatePresence mode="popLayout">
      {isSelectMode && (
        <motion.div
          key="select-action-buttons"
          layout
          animate={{
            filter: "blur(0px)",
            opacity: 1,

            rotate: 0,
            scale: 1,
            x: 0,
          }}
          exit={{
            filter: "blur(4px)",
            opacity: 0,

            transition: {
              duration: 0.2,
              ease: "easeIn",
              type: "tween",
            },
            x: xOffset,
          }}
          initial={{
            filter: "blur(4px)",
            opacity: 0,

            rotate: ltr ? -5 : 5,
            scale: 0.8,
            x: xOffset,
          }}
          transition={{
            damping: 15,
            duration: 0.2,
            ease: "easeOut",
            mass: 1,
            stiffness: 400,
            type: "spring",
          }}
        >
          <TextureContainer>
            <ButtonGroup
              className="bg-zinc-200 dark:bg-zinc-700 rounded-xl"
              isDisabled={isDisabled}
              radius="sm"
              variant="faded"
            >
              <Tooltip content={selectAll.tooltipText}>
                <Button
                  isIconOnly
                  className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
                  variant="shadow"
                  onPress={selectAllFiles}
                >
                  {selectAll.icon()}
                </Button>
              </Tooltip>
              <Tooltip content={clearSelected.tooltipText}>
                <Button
                  isIconOnly
                  className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
                  isDisabled={isDisabled || selectedFiles.length <= 0}
                  variant="shadow"
                  onPress={clearSelection}
                >
                  {clearSelected.icon()}
                </Button>
              </Tooltip>
              <Tooltip content={downloadSelected.tooltipText}>
                <Button
                  isIconOnly
                  className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
                  isDisabled={
                    isDisabled || selectedFiles.length <= 0 || isDownloading
                  }
                  isLoading={isDownloading}
                  variant="shadow"
                  onPress={downloadSelectedFiles}
                >
                  {downloadSelected.icon()}
                </Button>
              </Tooltip>
              <Tooltip color="danger" content={deleteSelected.tooltipText}>
                <Button
                  isIconOnly
                  className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
                  isDisabled={isDisabled || selectedFiles.length <= 0}
                  variant="shadow"
                  onPress={handleToggleDelete}
                >
                  {deleteSelected.icon()}
                </Button>
              </Tooltip>
            </ButtonGroup>
          </TextureContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
