"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { SelectModeButtonIcons } from "@/components/dashboard/header/select-mode/select-mode-button-icons";
import { TextureContainer } from "@/components/ui/texture-container";
import { useSelectionStore } from "@/stores/selection-store";
import { useDrawerStore } from "@/stores/drawer-store";
import { useUploadProcessStore } from "@/stores/upload-process-store";

export function SelectModeButton() {
  const isSelectMode = useSelectionStore((state) => state.isSelectMode);
  const toggleSelectMode = useSelectionStore((state) => state.toggleSelectMode);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const isAnimating = useDrawerStore((state) => state.isAnimating);

  const currentIcon =
    SelectModeButtonIcons.find((icon) =>
      isSelectMode
        ? icon.key === "cancel-file-selection"
        : icon.key === "select-files",
    ) || SelectModeButtonIcons[0];

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  return (
    <TextureContainer>
      <Tooltip content={currentIcon.tooltipText}>
        <Button
          isIconOnly
          className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
          isDisabled={isDisabled}
          variant="shadow"
          onPress={toggleSelectMode}
        >
          {currentIcon.icon()}
        </Button>
      </Tooltip>
    </TextureContainer>
  );
}
