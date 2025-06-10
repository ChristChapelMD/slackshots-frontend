"use client";

import Link from "next/link";
import Image from "next/image";

import { SelectModeButton } from "@/components/dashboard/header/select-mode/select-mode-button";
import { ViewSelectedButton } from "@/components/dashboard/header/select-mode/view-selected-button";
import { SelectActionButtons } from "@/components/dashboard/header/select-mode/select-action-buttons";
import { GridDensityToggle } from "@/components/dashboard/header/grid-density/grid-density-toggle";
import { SettingsButton } from "@/components/dashboard/header/settings-button";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="flex items-center justify-between px-4 h-16 rounded-t-xl border-zinc-700/25">
      <div className="flex items-center">
        <Link className="flex items-center" href="/">
          <Image
            alt="SlackShots Logo"
            className=""
            height={50}
            src="/SSLOGO_NOBG.png"
            width={50}
          />
          <h1 className="text-4xl tracking-tighter font-bold text-foreground hidden md:block">
            SlackShots
          </h1>
        </Link>
        {!isMobile && (
          <div className="ml-4">
            <GridDensityToggle />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!isMobile && (
          <>
            <ViewSelectedButton />
            <SelectActionButtons />
            <SelectModeButton />
          </>
        )}
        {isMobile && (
          <div className="ml-4">
            <GridDensityToggle />
          </div>
        )}
        <SettingsButton />
      </div>
    </header>
  );
}
