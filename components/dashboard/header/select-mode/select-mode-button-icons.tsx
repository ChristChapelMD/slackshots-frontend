import { ReactNode } from "react";
import {
  Selection,
  HandTap,
  Trash,
  Broom,
  FileArrowDown,
  X,
  SelectionAll,
  Files,
} from "@phosphor-icons/react";

interface BaseSelectionIconProps {
  children: ReactNode;
}

const subsetIconConfig =
  "absolute bg-zinc-200 dark:bg-zinc-700 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-500 transition-colors duration-200";

const BaseSelectionIcon = ({ children }: BaseSelectionIconProps) => (
  <div className="w-6 h-6 flex items-center justify-center">
    <div className="relative">
      {children}
      <Selection className="text-current" size={24} />
    </div>
  </div>
);

const EnableSelectModeIcon = () => (
  <BaseSelectionIcon>
    <HandTap
      className={`${subsetIconConfig} top-[9px] left-[9px] text-current`}
      size={16}
      weight="fill"
    />
  </BaseSelectionIcon>
);

const CancelSelectModeIcon = () => (
  <BaseSelectionIcon>
    <X
      className={`${subsetIconConfig} top-[13px] left-[14px] text-current`}
      size={12}
      weight="bold"
    />
  </BaseSelectionIcon>
);

const DeleteSelectedIcon = () => (
  <BaseSelectionIcon>
    <Trash
      className={`${subsetIconConfig} top-[9px] left-[9px] text-danger`}
      size={16}
      weight="fill"
    />
  </BaseSelectionIcon>
);

const DownloadSelectedIcon = () => (
  <BaseSelectionIcon>
    <FileArrowDown
      className={`${subsetIconConfig} top-[9px] left-[9px] text-primary`}
      size={16}
      weight="fill"
    />
  </BaseSelectionIcon>
);

const ClearSelectedIcon = () => (
  <BaseSelectionIcon>
    <Broom
      className={`${subsetIconConfig} top-[9px] left-[9px] text-current`}
      size={16}
      weight="fill"
    />
  </BaseSelectionIcon>
);

const SelectAllIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <SelectionAll className="text-current" size={24} />
  </div>
);

const ViewFilesIcon = () => <Files className={`text-current`} size={24} />;

export const SelectModeButtonIcons = [
  {
    key: "select-files",
    label: "Select Files",
    icon: () => <EnableSelectModeIcon />,
    tooltipText: "Select Files",
  },
  {
    key: "cancel-file-selection",
    label: "Cancel File Selection",
    icon: () => <CancelSelectModeIcon />,
    tooltipText: "Cancel File Selection",
  },
] as const;

export const SelectModeActionIcons = {
  selectAll: {
    key: "select-all",
    label: "Select All Files",
    icon: () => <SelectAllIcon />,
    tooltipText: "Select All Files (Ctrl+A)",
    shortcut: "Ctrl+A",
  },
  clearSelected: {
    key: "clear-selection",
    label: "Clear Selection",
    icon: () => <ClearSelectedIcon />,
    tooltipText: "Clear Selection",
    shortcut: "Ctrl+Esc",
  },
  deleteSelected: {
    key: "delete-selected",
    label: "Delete Selected Files",
    icon: () => <DeleteSelectedIcon />,
    tooltipText: "Delete Selected Files",
  },
  downloadSelected: {
    key: "download-selected",
    label: "Download Selected Files",
    icon: () => <DownloadSelectedIcon />,
    tooltipText: "Download Selected Files",
  },
  viewFiles: {
    key: "select-all",
    label: "View Selected Files",
    icon: () => <ViewFilesIcon />,
    tooltipText: "View Selected Files",
  },
};
