"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@heroui/skeleton";

import { useFileStore } from "@/stores/file-store";
import { FileItem } from "@/types/service-types/file-service";

interface ImageGridDisplayProps {
  item: FileItem;
}

export default function ImageGridDisplay({ item }: ImageGridDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prioritizedFileIds = useFileStore((state) => state.prioritizedFileIds);

  const isPriority = prioritizedFileIds.includes(item.fileID);

  return (
    <div className="relative w-full h-full aspect-square">
      {item.url && (
        <Image
          fill
          alt={item.name || "Image"}
          className={`object-cover transition-opacity duration-300 ${
            !isLoaded ? "opacity-0" : "opacity-100"
          }`}
          priority={isPriority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={item.url}
          onError={() => setHasError(true)}
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
        />
      )}

      {/* Move these to either item container or HOC components */}
      {(hasError || !item.url) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
          <Skeleton className="h-full w-full" isLoaded={false}>
            <div className="h-full w-full" />
          </Skeleton>
        </div>
      )}
    </div>
  );
}
