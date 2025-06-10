import { useEffect } from "react";

interface UsePriorityTrackOptions {
  selector: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  deps?: any[];
}

export function usePriorityTrack(
  onVisibilityChange: (visibleIds: string[]) => void,
  options: UsePriorityTrackOptions,
) {
  const {
    selector,
    threshold = 0.2,
    delay = 100,
    rootMargin = "0px",
    deps = [],
  } = options;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIds = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.getAttribute("data-file-id"))
          .filter(Boolean) as string[];

        onVisibilityChange(visibleIds);
      },
      { threshold, rootMargin },
    );

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => observer.observe(el));
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [selector, threshold, delay, rootMargin, ...deps]);
}
