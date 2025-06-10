import { useRef, useEffect } from "react";

interface UseInfiniteScrollOptions {
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
  onError?: (error: string) => void;
}

export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  deps: any[] = [],
  options: UseInfiniteScrollOptions = {},
) {
  const containerRef = useRef<T>(null);
  const {
    rootMargin = "600px",
    threshold = 0,
    disabled = false,
    onError,
  } = options;

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;

    if (!container) {
      if (onError) {
        onError("No scroll container found");
      }

      return;
    }

    const sentinel = container.querySelector(
      '[data-sentinel="true"]',
    ) as HTMLElement | null;

    if (!sentinel) {
      if (onError) {
        onError("No sentinel found inside scroll container");
      }

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        root: container,
        rootMargin,
        threshold,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [...deps, rootMargin, threshold, disabled]);

  return containerRef;
}
