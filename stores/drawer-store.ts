import { ReactNode } from "react";
import { create } from "zustand";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

export interface DrawerConfig {
  placement?: DrawerPlacement;
  size?: DrawerSize;
  title?: string;
  hideCloseButton?: boolean;
  hideFooter?: boolean;
  backdrop?: "opaque" | "transparent" | "blur";
  isDismissable?: boolean;
  inDashboard?: boolean;
}

interface DrawerState {
  isOpen: boolean;
  isAnimating: boolean;
  drawerId: string | null;
  content: ReactNode | null;
  config: DrawerConfig;

  openDrawer: (id: string, content: ReactNode, config?: DrawerConfig) => void;
  closeDrawer: () => void;
  setIsAnimating: (value: boolean) => void;
}

const defaultConfig: DrawerConfig = {
  placement: "right",
  size: "md",
  title: undefined,
  hideCloseButton: false,
  hideFooter: false,
  backdrop: "opaque",
  isDismissable: true,
  inDashboard: false,
};

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  isAnimating: false,
  drawerId: null,
  content: null,
  config: defaultConfig,

  openDrawer: (id, content, config) =>
    set({
      isOpen: true,
      drawerId: id,
      content,
      config: { ...defaultConfig, ...config },
    }),

  closeDrawer: () => {
    set({
      isOpen: false,
      drawerId: null,
      content: null,
      config: defaultConfig,
    });
  },

  setIsAnimating: (value) => set({ isAnimating: value }),
}));
