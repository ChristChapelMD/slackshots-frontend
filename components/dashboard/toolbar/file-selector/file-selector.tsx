"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { File, FolderOpen } from "@phosphor-icons/react";
import { memo } from "react";

import { FileSelectorCard } from "@/components/dashboard/toolbar/file-selector/file-selector-card";
import { useFileHandlers } from "@/hooks/use-file-handlers";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDrawerStore } from "@/stores/drawer-store";
import { useUploadProcessStore } from "@/stores/upload-process-store";

export const FileSelector = memo(function FileSelector() {
  const {
    acceptedFileTypes,
    fileCount,
    selectionType,
    filesInputRef,
    folderInputRef,
    handleFilesChange,
    handleFolderChange,
    clearSelection,
    inputKey,
  } = useFileHandlers();
  const [activeTab, setActiveTab] = useState<"files" | "folder">("files");
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const lastUploadTimestamp = useUploadProcessStore(
    (state) => state.lastUploadTimestamp,
  );
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const isOpen = useDrawerStore((state) => state.isOpen);

  const isDrawerOpen = useMemo(
    () => isOpen || isAnimating,
    [isOpen, isAnimating],
  );
  const isDisabled = useMemo(
    () => isDrawerOpen || isUploading,
    [isDrawerOpen, isUploading],
  );

  const handleTabChange = useCallback((key: React.Key) => {
    setSlideDirection(key === "files" ? -1 : 1);
    setActiveTab(key.toString() as "files" | "folder");
  }, []);

  const handleCardPress = useCallback(() => {
    if (activeTab === "files") {
      filesInputRef.current?.click();
    } else {
      folderInputRef.current?.click();
    }
  }, [activeTab, filesInputRef, folderInputRef]);

  const handleMobileCardPress = useCallback(() => {
    filesInputRef.current?.click();
  }, [filesInputRef]);

  useEffect(() => {
    if (lastUploadTimestamp > 0) {
      clearSelection();
    }
  }, [lastUploadTimestamp, clearSelection]);

  const tabConfig = useMemo(
    () => [
      {
        key: "files" as const,
        icon: <File size={20} />,
        title: "Select Files",
        isActive: fileCount > 0 && selectionType === "files",
      },
      {
        key: "folder" as const,
        icon: <FolderOpen size={20} />,
        title: "Select Folder",
        isActive: fileCount > 0 && selectionType === "folder",
      },
    ],
    [fileCount, selectionType],
  );

  const tabsClassNames = useMemo(
    () => ({
      base: "flex flex-col items-center",
      tabList:
        "bg-gray-50 dark:bg-[#181818] rounded-t-lg border-b border-zinc-200 dark:border-b-zinc-700 w-full",
      tab: "data-[selected=true]:bg-white dark:data-[selected=true]:bg-[#282828] flex justify-center",
      tabContent: "rounded-b-lg p-0 flex flex-col items-center w-full",
      panel: "flex flex-col items-center w-full",
    }),
    [],
  );

  // Mobile file selector
  if (isMobile) {
    return (
      <div className="w-full">
        <FileSelectorCard
          activeTab="files"
          clearSelection={clearSelection}
          fileCount={fileCount}
          handleCardPress={handleMobileCardPress}
          isDisabled={isDisabled}
          isSelected={fileCount > 0 && selectionType === "files"}
          slideDirection={0}
        />

        <Input
          key={`files-${inputKey}`}
          ref={filesInputRef}
          multiple
          accept={acceptedFileTypes.join(",")}
          aria-hidden="true"
          className="hidden"
          type="file"
          onChange={handleFilesChange}
        />
      </div>
    );
  }

  // Desktop file selector with tabs
  return (
    <div className="flex flex-col items-center w-full">
      <Tabs
        aria-label="File Selection Options"
        className="w-full"
        classNames={tabsClassNames}
        isDisabled={isDisabled}
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
      >
        {tabConfig.map((tab) => (
          <Tab
            key={tab.key}
            isDisabled={isDisabled}
            title={
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span>{tab.title}</span>
              </div>
            }
          >
            <div className="w-full flex flex-col items-center">
              <FileSelectorCard
                activeTab={tab.key}
                clearSelection={clearSelection}
                fileCount={fileCount}
                handleCardPress={handleCardPress}
                isDisabled={isDisabled}
                isSelected={tab.isActive}
                slideDirection={slideDirection}
              />
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                {activeTab === "files"
                  ? `Accepted file types: ${acceptedFileTypes.join(", ")}`
                  : "All matching files will be uploaded"}
              </p>
            </div>
          </Tab>
        ))}
      </Tabs>

      <Input
        key={`files-${inputKey}`}
        ref={filesInputRef}
        multiple
        accept={acceptedFileTypes.join(",")}
        aria-hidden="true"
        className="hidden"
        isDisabled={isDisabled}
        type="file"
        onChange={handleFilesChange}
      />

      <Input
        key={`folder-${inputKey}`}
        ref={folderInputRef}
        multiple
        className="hidden"
        isDisabled={isDisabled}
        type="file"
        {...{ webkitdirectory: true }}
        onChange={handleFolderChange}
      />
    </div>
  );
});
