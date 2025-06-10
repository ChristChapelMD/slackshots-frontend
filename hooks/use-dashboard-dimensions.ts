import { useState, useEffect, useRef } from "react";

export function useContainerDimensions<
  T extends HTMLElement = HTMLDivElement,
>() {
  const containerRef = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  return { containerRef, dimensions };
}
