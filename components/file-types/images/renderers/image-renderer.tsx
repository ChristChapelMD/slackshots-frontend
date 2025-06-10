"use client";

import ImageGridDisplay from "../displays/image-grid";
import ImageListDisplay from "../displays/image-list";
import ImageDetailDisplay from "../displays/image-detail";
import ImagePreviewDisplay from "../displays/image-preview";

import { useUIStore } from "@/stores/ui-store";
import { FileItem } from "@/types/service-types/file-service";

const displayComponents: Record<
  "grid" | "list" | "detail" | "preview",
  React.ComponentType<{ item: FileItem }>
> = {
  grid: ImageGridDisplay,
  list: ImageListDisplay,
  detail: ImageDetailDisplay,
  preview: ImagePreviewDisplay,
} as const;

export default function ImageRenderer({ item }: { item: FileItem }) {
  const viewMode = useUIStore((state) => state.viewMode);

  const DisplayComponent =
    displayComponents[viewMode] || displayComponents.grid;

  return <DisplayComponent item={item} />;
}
