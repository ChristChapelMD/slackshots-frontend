"use client";

import { SelectModeButton } from "@/components/dashboard/header/select-mode/select-mode-button";
import { ViewSelectedButton } from "@/components/dashboard/header/select-mode/view-selected-button";
import { SelectActionButtons } from "@/components/dashboard/header/select-mode/select-action-buttons";

export function SelectModeActions() {
  return (
    <div className="flex items-center space-x-2">
      <ViewSelectedButton />
      <SelectActionButtons />
      <SelectModeButton />
    </div>
  );
}
