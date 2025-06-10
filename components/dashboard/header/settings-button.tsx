"use client";
import { useRef } from "react";
import { Button } from "@heroui/button";
import { Gear } from "@phosphor-icons/react";
import { Tooltip } from "@heroui/tooltip";

import { TextureContainer } from "@/components/ui/texture-container";
import { useDrawerStore } from "@/stores/drawer-store";
import { SettingsDrawer } from "@/components/drawers/dashboard/settings-drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SettingsButton() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isOpen = useDrawerStore((state) => state.isOpen);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const drawerId = useDrawerStore((state) => state.drawerId);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const isSettingsDrawerOpen = isOpen && drawerId === "settings";

  const lastClickedRef = useRef(0);

  const handleToggleSettings = () => {
    const now = Date.now();

    if (now - lastClickedRef.current < 500 || isAnimating) return;
    lastClickedRef.current = now;

    if (isSettingsDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer("settings", <SettingsDrawer />, {
        title: "Settings",
        placement: isMobile ? "bottom" : "right",
        size: "md",
        backdrop: "blur",
      });
    }
  };

  const isDisabled = (isOpen && !isSettingsDrawerOpen) || isAnimating;

  return (
    <TextureContainer>
      <Tooltip content="Settings">
        <Button
          isIconOnly
          className={`focus-visible-inset bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500 ${isDisabled ? "cursor-not-allowed" : ""}`}
          disabled={isDisabled}
          variant="shadow"
          onPress={handleToggleSettings}
        >
          <Gear size={24} />
        </Button>
      </Tooltip>
    </TextureContainer>
  );
}
