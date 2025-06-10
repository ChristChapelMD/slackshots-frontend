"use client";

import { memo } from "react";
import { Card, CardBody } from "@heroui/card";
import { AnimatePresence } from "framer-motion";

import { SelectedFilesView } from "@/components/dashboard/toolbar/file-selector/selected-files-view";
import { EmptySelectorView } from "@/components/dashboard/toolbar/file-selector/empty-selector-view";

interface FileSelectorCardProps {
  activeTab: "files" | "folder";
  isSelected: boolean;
  fileCount: number;
  isDisabled: boolean;
  slideDirection: number;
  clearSelection: () => void;
  handleCardPress: () => void;
}

export const FileSelectorCard = memo(function FileSelectorCard({
  activeTab,
  isSelected,
  fileCount,
  isDisabled,
  slideDirection,
  clearSelection,
  handleCardPress,
}: FileSelectorCardProps) {
  return (
    <div
      className={`p-2 rounded-large w-full shadow-well-md dark:shadow-well-dark-sm ${
        isSelected ? "" : "bg-zinc-100 dark:bg-zinc-800"
      }`}
    >
      <Card
        disableRipple
        aria-label={
          isSelected
            ? "Selected files"
            : activeTab === "files"
              ? "Click to select files"
              : "Click to select a folder"
        }
        className={`w-full ${
          isSelected
            ? "bg-green-200 dark:bg-green-900/20 border-green-300 dark:border-green-700"
            : "bg-transparent border-zinc-300/50 hover:border-zinc-400/50 dark:border-zinc-700/50 dark:hover:border-zinc-600/50 border-2 border-dashed"
        }`}
        isDisabled={isDisabled}
        isPressable={!isDisabled}
        shadow="none"
        onPress={handleCardPress}
      >
        <CardBody className="p-6 overflow-hidden h-48 flex items-center justify-center">
          <AnimatePresence custom={slideDirection} mode="wait">
            {isSelected ? (
              <SelectedFilesView
                activeTab={activeTab}
                clearSelection={clearSelection}
                fileCount={fileCount}
                isDisabled={isDisabled}
                slideDirection={slideDirection}
              />
            ) : (
              <EmptySelectorView
                activeTab={activeTab}
                slideDirection={slideDirection}
              />
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </div>
  );
});
