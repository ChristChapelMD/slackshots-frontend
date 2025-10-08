"use client";

import { X, Download, Share } from "@phosphor-icons/react";
import { Button, ButtonGroup } from "@heroui/button";

import { TextureContainer } from "@/components/ui/texture-container";
import { FileItem } from "@/types/service-types/file-service";
import { useFileDownload } from "@/hooks/use-file-download";
import { FileRenderer } from "@/components/file-types/file-renderer";
import { formatFileSize } from "@/lib/utils/format-utils";
import { useDrawerStore } from "@/stores/drawer-store";

interface FileDrawerProps {
  item: FileItem;
  view: "detail" | "preview";
}

export function FileDrawer({ item, view }: FileDrawerProps) {
  const { downloadSingleFile } = useFileDownload();
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const handleDownload = async () => {
    try {
      downloadSingleFile(item);
    } catch (error) {
      throw error;
    }
  };

  const handleClose = () => {
    closeDrawer();
  };

  if (view === "preview") {
    return (
      <TextureContainer className="flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            isIconOnly
            className="bg-black/30 text-white hover:bg-black/50"
            color="default"
            size="sm"
            variant="flat"
            onPress={handleDownload}
          >
            <Download size={18} />
          </Button>
          <Button
            isIconOnly
            className="bg-black/30 text-white hover:bg-black/50"
            color="default"
            size="sm"
            variant="flat"
            onPress={handleClose}
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <FileRenderer item={item} viewMode="preview" />
        </div>
      </TextureContainer>
    );
  }

  return (
    <TextureContainer className="h-full flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium truncate max-w-md">
          {item.fileName}
        </h2>
        <div className="flex items-center gap-2">
          <ButtonGroup size="sm" variant="flat">
            <Button onPress={handleDownload}>
              <Download size={18} />
            </Button>
            <Button>
              <Share size={18} />
            </Button>
          </ButtonGroup>
          <Button isIconOnly size="sm" variant="light" onPress={handleClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File details section */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="font-medium">File Size</div>
            <div className="col-span-2">{formatFileSize(item.fileSize)}</div>

            <div className="font-medium">Type</div>
            <div className="col-span-2">{item.fileType}</div>

            {/*VERY IMPORTANT - CHANGE THIS TO BE IMAGE DIMENSIONS, NEED TO UPDATE FILE RECORD SCHEMA */}
            {item.fileSize && item.fileSize && (
              <>
                <div className="font-medium">Dimensions</div>
                <div className="col-span-2">
                  {item.fileSize}×{item.fileSize}px
                </div>
              </>
            )}

            <div className="font-medium">Uploaded</div>
            <div className="col-span-2">Fix date thingy later</div>
          </div>
        </div>
      </div>
    </TextureContainer>
  );
}
