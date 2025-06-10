type CalculatePageOptions = {
  containerWidth: number;
  containerHeight: number;
  gridDensity: "lo" | "md" | "hi";
  aspectRatio?: number;
  gap?: number;
};

export function calculatePageSize({
  containerWidth,
  containerHeight,
  gridDensity,
  aspectRatio = 1,
  gap = 12,
}: CalculatePageOptions): number {
  let columns: number;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;

  if (gridDensity === "lo") {
    if (screenWidth < 640) columns = 1;
    else if (screenWidth < 768) columns = 2;
    else if (screenWidth < 1024) columns = 3;
    else columns = 4;
  } else if (gridDensity === "md") {
    if (screenWidth < 640) columns = 2;
    else if (screenWidth < 768) columns = 3;
    else if (screenWidth < 1024) columns = 4;
    else if (screenWidth < 1280) columns = 5;
    else columns = 6;
  } else {
    if (screenWidth < 640) columns = 3;
    else if (screenWidth < 768) columns = 4;
    else if (screenWidth < 1024) columns = 5;
    else if (screenWidth < 1280) columns = 7;
    else columns = 8;
  }

  const totalGapWidth = (columns - 1) * gap;
  const itemWidth = (containerWidth - totalGapWidth) / columns;

  const itemHeight = itemWidth / aspectRatio;

  const rowsInView = Math.ceil(containerHeight / (itemHeight + gap));

  const neededItems = columns * (rowsInView + 1);

  return Math.max(16, Math.round(neededItems * 1.5));
}
