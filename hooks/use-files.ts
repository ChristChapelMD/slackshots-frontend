"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/services/client";

const STALE_TIME = 1000 * 60 * 5;

export function useFiles() {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["files"],
    queryFn: ({ pageParam = 1 }) => client.files.fetchFiles(pageParam, 16),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: STALE_TIME,
  });

  const files = data?.pages.flatMap((page) => page.files) ?? [];

  const refreshFiles = () => {
    queryClient.invalidateQueries({ queryKey: ["files"] });
  };

  return {
    files,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refreshFiles,
  };
}
