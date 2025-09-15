"use client";

import { useEffect, useCallback, useRef } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";

import { useFiles } from "@/hooks/use-files";
import { useUIStore } from "@/stores/ui-store";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { GridView } from "@/components/dashboard/content/grid/grid-view";
import { cn } from "@/lib/utils";
import { BaseDrawer } from "@/components/drawers/dashboard/base-drawer";
import { useWorkspace } from "@/hooks/use-workspace";
import SlackLogo from "@/public/SLA-appIcon-desktop.png";
import { useAuth } from "@/hooks/use-auth";

export function MainContentContainer() {
  const { loadFiles, isLoading, hasMore } = useFiles();
  const viewMode = useUIStore((state) => state.viewMode);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const {
    currentWorkspace,
    fetchCurrentWorkspace,
    addWorkspace,
    workspaceLoading,
  } = useWorkspace();

  useEffect(() => {
    loadFiles(false);
    fetchCurrentWorkspace();
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
        {currentWorkspace ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Connect a Workspace
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 max-w-md">
              You don’t have a workspace connected yet. Click below to add your
              Slack workspace and start using the app.
            </p>
            <Button
              className="flex items-center justify-center gap-2 w-full max-w-xs rounded-lg px-4 py-3 text-slate-900 font-medium border border-zinc-300 bg-white shadow-sm hover:shadow-md transition-shadow"
              isLoading={workspaceLoading}
              onPress={() => addWorkspace()}
            >
              <Image alt="Slack Logo" height={24} src={SlackLogo} width={24} />
              {workspaceLoading
                ? "...Authenticating with Slack"
                : "Continue with Slack"}
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <>
                <GridView />
                <div className="h-32 boder-8 border-red-900 z-50" />
                <div className="boder-8 border-red-900" data-sentinel="true" />
              </>
            )}
          </>
        )}
        <BaseDrawer containerRef={mainContainerRef} />
      </main>
    </div>
  );
}
