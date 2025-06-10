import { create } from "zustand";

import { ViewMode } from "@/lib/file-types/handlers/file-type-handler";

type GridDensity = "lo" | "md" | "hi";

interface UIState {
  gridDensity: GridDensity;
  setGridDensity: (density: GridDensity) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  gridDensity: "md",
  setGridDensity: (gridDensity) => {
    set({ gridDensity });
    localStorage.setItem("gridDensity", gridDensity);
  },

  viewMode: "grid" as ViewMode,
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredViewMode", mode);
    }
  },
}));

// Initialize from localStorage when in browser
if (typeof window !== "undefined") {
  const savedGridDensity = localStorage.getItem("gridDensity");

  if (savedGridDensity && ["lo", "md", "hi"].includes(savedGridDensity)) {
    useUIStore.setState({
      gridDensity: savedGridDensity as "lo" | "md" | "hi",
    });
  } else {
    localStorage.setItem("gridDensity", "md");
  }
}
