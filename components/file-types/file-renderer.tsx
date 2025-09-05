import React, { Suspense, useState, useEffect, memo } from "react";
import { Skeleton } from "@heroui/skeleton";

import { useUIStore } from "@/stores/ui-store";
import { FileItem } from "@/types/service-types/file-service";
import { fileTypeRegistry } from "@/lib/file-types/file-type-registry";
import { ViewMode } from "@/lib/file-types/handlers/file-type-handler";

export const FileRenderer = memo(
  ({
    item,
    viewMode: forcedViewMode,
  }: {
    item: FileItem;
    viewMode?: ViewMode;
  }) => {
    const defaultViewMode = useUIStore((state) => state.viewMode);
    const viewMode = forcedViewMode || defaultViewMode;

    const [Component, setComponent] = useState<React.ComponentType<{
      item: FileItem;
    }> | null>(null);

    useEffect(() => {
      const handler = item.fileType
        ? fileTypeRegistry.getHandlerForMimeType(item.fileType)
        : fileTypeRegistry.getHandlerForExtension(
            item.name.split(".").pop() || "",
          );

      if (!handler) {
        setComponent(null);

        return;
      }

      let RendererComponent;

      switch (viewMode) {
        case "grid":
          RendererComponent =
            handler.getGridRenderer?.() || handler.getRenderer();
          break;
        case "list":
          RendererComponent =
            handler.getListRenderer?.() || handler.getRenderer();
          break;
        case "detail":
          RendererComponent =
            handler.getDetailRenderer?.() || handler.getRenderer();
          break;
        case "preview":
          RendererComponent =
            handler.getPreviewRenderer?.() || handler.getRenderer();
          break;
        default:
          RendererComponent = handler.getRenderer();
      }

      setComponent(() => RendererComponent);
    }, [item.fileID, item.fileType, item.name, viewMode]);

    if (!Component) {
      return (
        <Skeleton className="h-full w-full" isLoaded={false}>
          <div className="h-full w-full" />
        </Skeleton>
      );
    }

    return (
      <Suspense
        fallback={
          <Skeleton className="h-full w-full" isLoaded={false}>
            <div className="h-full w-full" />
          </Skeleton>
        }
      >
        <Component item={item} />
      </Suspense>
    );
  },
);

FileRenderer.displayName = "FileRenderer";
