import { useState, useCallback } from "react";
import React from "react";

import { useClickHandler } from "./use-click-handler";

import { fileTypeRegistry } from "@/lib/file-types/file-type-registry";
import { useDrawerStore } from "@/stores/drawer-store";
import { useSelectionStore } from "@/stores/selection-store";
import { FileItem } from "@/types/service-types/file-service";
import { FileDrawer } from "@/components/drawers/dashboard/file-drawer";
import { useUploadProcessStore } from "@/stores/upload-process-store";

export function useGridItemInteraction(item: FileItem) {
  const [isHovered, setIsHovered] = useState(false);

  const isSelectMode = useSelectionStore((state) => state.isSelectMode);
  const selectedFiles = useSelectionStore((state) => state.selectedFiles);
  const toggleFileSelection = useSelectionStore(
    (state) => state.toggleFileSelection,
  );
  const setSelectedFiles = useSelectionStore((state) => state.setSelectedFiles);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const openDrawer = useDrawerStore((state) => state.openDrawer);

  const isSelected = selectedFiles.some((file) => file.fileID === item.fileID);
  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) {
      setIsHovered(true);
    }
  }, [isDisabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleSingleClick = useCallback(() => {
    setSelectedFiles([item]);

    openDrawer(
      "detail",
      React.createElement(FileDrawer, { item, view: "detail" }),
      {
        title: "",
        placement: "left",
        size: "sm",
        backdrop: "blur",
        hideCloseButton: true,
        hideFooter: true,
      },
    );
  }, [item, setSelectedFiles, openDrawer]);

  const handleDoubleClick = useCallback(() => {
    const handler = item.fileType
      ? fileTypeRegistry.getHandlerForMimeType(item.fileType)
      : fileTypeRegistry.getHandlerForExtension(
          item.name.split(".").pop() || "",
        );

    if (handler && handler.canPreview) {
      openDrawer(
        "preview",
        React.createElement(FileDrawer, { item, view: "preview" }),
        {
          title: "",
          placement: "bottom",
          size: "3xl",
          backdrop: "opaque",
          hideCloseButton: true,
          hideFooter: true,
        },
      );
    } else {
      handleSingleClick();
    }
  }, [item, openDrawer, handleSingleClick]);

  const clickHandler = useClickHandler(handleSingleClick, handleDoubleClick);

  const handleItemInteraction = useCallback(() => {
    if (isSelectMode) {
      toggleFileSelection(item);
    } else {
      clickHandler();
    }
  }, [isSelectMode, toggleFileSelection, item, clickHandler]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleItemInteraction();
      }
    },
    [handleItemInteraction],
  );

  return {
    isHovered,
    isSelected,
    isDisabled,
    isSelectMode,
    handleMouseEnter,
    handleMouseLeave,
    handleItemInteraction,
    handleKeyDown,
  };
}
