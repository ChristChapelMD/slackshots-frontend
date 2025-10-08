"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";

import { FileItem } from "@/types/service-types/file-service";

interface ImagePreviewDisplayProps {
  item: FileItem;
}

export default function ImagePreviewDisplay({
  item,
}: ImagePreviewDisplayProps) {
  const [hasError, setHasError] = useState(false);
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((current) => Math.min(current + 0.25, 3));
  const zoomOut = () => setScale((current) => Math.max(current - 0.25, 0.5));

  const providerFileId = item.uploads?.[0]?.providerFileId;
  const imageUrl = providerFileId ? `/api/files/${providerFileId}` : null;

  return (
    <div className="relative h-[80vh] bg-black/80 flex items-center justify-center">
      <div
        className="relative transition-transform duration-300"
        style={{ transform: `scale(${scale})` }}
      >
        {imageUrl && (
          <Image
            unoptimized
            alt={item.fileName || "Preview"}
            className="object-contain max-h-[80vh] max-w-full"
            height={item.fileSize || 600}
            src={imageUrl}
            width={item.fileSize || 800}
            onError={() => setHasError(true)}
          />
        )}

        {hasError && (
          <div className="text-white text-center p-4 border border-white/20 rounded">
            Unable to preview this image
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          onClick={zoomOut}
        >
          <MagnifyingGlassMinus size={20} />
        </button>
        <button
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          onClick={zoomIn}
        >
          <MagnifyingGlassPlus size={20} />
        </button>
      </div>
    </div>
  );
}
