import { FolderOpen, UploadSimple } from "@phosphor-icons/react";

interface SelectorIconProps {
  activeTab: "files" | "folder";
  isSelected: boolean;
}

export function SelectorIcon({ activeTab, isSelected }: SelectorIconProps) {
  const iconClassName = isSelected
    ? "text-green-600 dark:text-green-300"
    : "text-zinc-600 dark:text-zinc-300";

  return activeTab === "files" ? (
    <UploadSimple className={iconClassName} size={24} />
  ) : (
    <FolderOpen className={iconClassName} size={24} />
  );
}
