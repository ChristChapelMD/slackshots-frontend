"use client";

import { useEffect, useCallback, useRef } from "react";

import { useFiles } from "@/hooks/use-files";
import { useUIStore } from "@/stores/ui-store";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { GridView } from "@/components/dashboard/content/grid/grid-view";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/components/drawers/dashboard/base-drawer";

export function MainContentContainer() {
  const { loadFiles, isLoading, hasMore } = useFiles();
  const viewMode = useUIStore((state) => state.viewMode);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFiles(false);
  }, [loadFiles]);

  const scrollCallback = useCallback(() => {
    if (!isLoading && hasMore) {
      loadFiles(true);
    }
  }, [isLoading, hasMore, loadFiles]);

  const scrollRef = useInfiniteScroll(scrollCallback, []);

  const insetBorderOffset = 8;

  return (
    <div
      ref={mainContainerRef}
      className={cn(
        "relative flex-1 overflow-hidden",
        viewMode === "grid"
          ? `bg-zinc-50 dark:bg-zinc-900 border-${insetBorderOffset} border-zinc-100 dark:border-zinc-800 rounded-3xl`
          : "bg-transparent border-none",
      )}
    >
      {viewMode === "grid" && (
        <div className="absolute inset-0 pointer-events-none z-10 shadow-well-lg dark:shadow-well-dark-lg" />
      )}
      <main
        ref={scrollRef}
        className={cn(
          "relative h-full w-full overflow-y-auto z-0",
          viewMode === "grid" ? "bg-zinc-100 dark:bg-zinc-800 p-4" : "p-6",
        )}
      >
        {viewMode === "grid" && (
          <>
            <GridView />
            <div className="h-32 boder-8 border-red-900 z-50" />
            <div className="boder-8 border-red-900" data-sentinel="true" />
          </>
        )}
        <BaseDrawer containerRef={mainContainerRef} />
      </main>
    </div>
  );
}
