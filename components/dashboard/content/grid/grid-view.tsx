"use client";

import GridItem from "./grid-item";

import { useFiles } from "@/hooks/use-files";
import { useFileStore } from "@/stores/file-store";
import { useUIStore } from "@/stores/ui-store";
import LoadingAnimation from "@/components/ui/loading-animation";
import { usePriorityTrack } from "@/hooks/use-priority-track";
import { useGridDensity } from "@/hooks/use-grid-density";

export function GridView() {
  const { gridDensity } = useGridDensity();
  const viewMode = useUIStore((state) => state.viewMode);

  const { files, isLoading } = useFiles();
  const setPrioritizedFileIds = useFileStore(
    (state) => state.setPrioritizedFileIds,
  );

  usePriorityTrack((visibleIds) => setPrioritizedFileIds(visibleIds), {
    selector: "[data-file-id]",
    threshold: 0.2,
    deps: [files.length],
  });

  if (files.length === 0 && isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (files.length === 0 && !isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-4xl text-zinc-500 dark:text-zinc-400 font-light">
          No files found
        </p>
      </div>
    );
  }

  if (viewMode !== "grid") {
    return null;
  }

  return (
    <>
      <div
        className={
          gridDensity === "lo"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3"
            : gridDensity === "md"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3"
        }
      >
        {files.map((item) => (
          <div key={item.fileID} data-file-id={item.fileID}>
            <GridItem item={item} />
          </div>
        ))}
        {isLoading && files.length > 0 && (
          <div className="w-full col-span-full flex justify-center py-2">
            <div className="scale-75">
              <LoadingAnimation />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
