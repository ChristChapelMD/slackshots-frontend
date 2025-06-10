"use client";

import { useState, useEffect } from "react";

import { useUIStore } from "@/stores/ui-store";

type GridDensity = "lo" | "md" | "hi";

export function useGridDensity() {
  const gridDensity = useUIStore((state) => state.gridDensity);
  const setGridDensity = useUIStore((state) => state.setGridDensity);

  const [density, setDensity] = useState<GridDensity>(gridDensity);

  useEffect(() => {
    if (gridDensity !== density) {
      setDensity(gridDensity);
    }
  }, [gridDensity]);

  const updateDensity = (newDensity: GridDensity) => {
    setDensity(newDensity);
    setGridDensity(newDensity);
  };

  return {
    gridDensity: density,
    setGridDensity: updateDensity,
  };
}
