/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useFileStore } from "@/stores/file-store";

export function IntersectionObserverVisualizer() {
  // Get prioritized file IDs from store to highlight "above fold" elements
  const prioritizedFileIds = useFileStore((state) => state.prioritizedFileIds);

  const [observedElements, setObservedElements] = useState<
    Array<{
      id: string;
      isIntersecting: boolean;
      rect: DOMRect;
      isPrioritized: boolean;
    }>
  >([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [sentinelRect, setSentinelRect] = useState<DOMRect | null>(null);
  const [rootMargin, setRootMargin] = useState<string | null>(null);

  // Function to find the scroll sentinel element
  const findScrollSentinel = () => {
    // Common IDs and classes for sentinel elements
    const possibleSelectors = [
      "#scroll-sentinel",
      "[data-sentinel]",
      ".sentinel",
      // Look at the last child of your grid container
      ".grid > div:last-child",
    ];

    for (const selector of possibleSelectors) {
      const element = document.querySelector(selector);

      if (element) {
        const rect = element.getBoundingClientRect();

        setSentinelRect(rect);

        // Try to find the root margin from any observer options
        const script = document.querySelector(
          'script[type="text/json"][data-observer-options]',
        );

        if (script) {
          try {
            const options = JSON.parse(script.textContent || "{}");

            setRootMargin(options.rootMargin || "200px");
          } catch (e) {
            console.error("Could not parse observer options", e);
          }
        }

        return;
      }
    }
  };

  useEffect(() => {
    // Update viewport size and find sentinel
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    findScrollSentinel();

    // Set up window resize handler
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      findScrollSentinel();
    };

    window.addEventListener("resize", handleResize);

    // Create a mutation observer to detect when data-file-id elements are added
    const mutationObserver = new MutationObserver(() => {
      // Find all elements with data-file-id
      const elements = document.querySelectorAll("[data-file-id]");

      // Check for sentinel changes
      findScrollSentinel();

      // Set up an intersection observer for each element
      const observer = new IntersectionObserver(
        (entries) => {
          setObservedElements((prev) => {
            const updated = [...prev];

            entries.forEach((entry) => {
              const id = entry.target.getAttribute("data-file-id") || "";
              const rect = entry.target.getBoundingClientRect();
              const isPrioritized = prioritizedFileIds.includes(id);

              const existingIndex = updated.findIndex((el) => el.id === id);

              if (existingIndex >= 0) {
                updated[existingIndex] = {
                  id,
                  isIntersecting: entry.isIntersecting,
                  rect,
                  isPrioritized,
                };
              } else {
                updated.push({
                  id,
                  isIntersecting: entry.isIntersecting,
                  rect,
                  isPrioritized,
                });
              }
            });

            return updated;
          });

          console.log(
            "[Observer Debug] Intersection entries:",
            entries.map((e) => ({
              id: e.target.getAttribute("data-file-id"),
              isIntersecting: e.isIntersecting,
              intersectionRatio: e.intersectionRatio,
              boundingClientRect: e.boundingClientRect,
            })),
          );
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      elements.forEach((el) => observer.observe(el));

      console.log(
        "[Observer Debug] Observing elements:",
        Array.from(elements).map((el) => ({
          id: el.getAttribute("data-file-id"),
          position: el.getBoundingClientRect(),
        })),
      );

      return () => observer.disconnect();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [prioritizedFileIds]);

  if (process.env.NODE_ENV !== "development") return null;

  const thresholdLinePosition = sentinelRect
    ? { top: sentinelRect.top, width: viewport.width }
    : null;

  const rootMarginValue = rootMargin
    ? parseInt(rootMargin.replace("px", ""))
    : 200;

  const loadMoreThresholdPosition =
    sentinelRect && rootMargin
      ? { top: sentinelRect.top - rootMarginValue, width: viewport.width }
      : null;

  return createPortal(
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ width: viewport.width, height: viewport.height }}
    >
      {/* Debug info panel */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-md max-w-xs z-50">
        <h3 className="text-sm font-bold mb-2">Observer Debug</h3>
        <p className="text-xs mb-2">
          Elements observed: {observedElements.length}
          <br />
          Intersecting:{" "}
          {observedElements.filter((e) => e.isIntersecting).length}
          <br />
          Above fold: {observedElements.filter((e) => e.isPrioritized).length}
        </p>

        <div className="flex gap-2 text-xs mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-1" />
            <span>Visible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1" />
            <span>Hidden</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1" />
            <span>Priority</span>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto">
          {observedElements.map((el) => (
            <div
              key={el.id}
              className={`text-xs mb-1 ${
                el.isPrioritized
                  ? "text-blue-400"
                  : el.isIntersecting
                    ? "text-green-400"
                    : "text-red-400"
              }`}
            >
              {el.id.slice(0, 8)}... {el.isIntersecting ? "✓" : "✗"}
              {el.isPrioritized ? " (priority)" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Visualize observed elements */}
      {observedElements.map((el) => (
        <div
          key={el.id}
          className={`absolute border-2 ${
            el.isPrioritized
              ? "border-blue-500 bg-blue-200/20"
              : el.isIntersecting
                ? "border-green-500"
                : "border-red-500"
          } rounded-md`}
          style={{
            top: el.rect.top,
            left: el.rect.left,
            width: el.rect.width,
            height: el.rect.height,
          }}
        >
          <div
            className={`absolute top-0 right-0 text-xs ${
              el.isPrioritized
                ? "bg-blue-500"
                : el.isIntersecting
                  ? "bg-green-500"
                  : "bg-red-500"
            } text-white px-1`}
          >
            {el.id.slice(0, 6)}
          </div>
        </div>
      ))}

      {/* Sentinel position line */}
      {thresholdLinePosition && (
        <div
          className="absolute border-t-2 border-yellow-500 left-0 right-0 flex items-center justify-between px-4"
          style={{
            top: thresholdLinePosition.top,
            width: thresholdLinePosition.width,
          }}
        >
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-md">
            Sentinel
          </div>
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-md">
            Position: {Math.round(thresholdLinePosition.top)}px
          </div>
        </div>
      )}

      {/* Load-more threshold line */}
      {loadMoreThresholdPosition && (
        <div
          className="absolute border-t-2 border-dashed border-orange-500 left-0 right-0 flex items-center justify-between px-4"
          style={{
            top: loadMoreThresholdPosition.top,
            width: loadMoreThresholdPosition.width,
          }}
        >
          <div className="bg-orange-500 text-black text-xs px-2 py-1 rounded-md">
            Load More Trigger ({rootMargin})
          </div>
          <div className="bg-orange-500 text-black text-xs px-2 py-1 rounded-md">
            Position: {Math.round(loadMoreThresholdPosition.top)}px
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
