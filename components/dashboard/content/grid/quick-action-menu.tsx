"use client";

import { useState, useEffect, useRef } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { FileItem } from "@/types/service-types/file-service";
import { useSelectionStore } from "@/stores/selection-store";
import { useDrawerStore } from "@/stores/drawer-store";
import { useFileDownload } from "@/hooks/use-file-download";
import { DeleteDrawer } from "@/components/drawers/dashboard/delete-drawer";

interface QuickActionMenuProps {
  item: FileItem;
  isHovered: boolean;
  isSelectMode: boolean;
}

export function QuickActionMenu({
  item,
  isHovered,
  isSelectMode,
}: QuickActionMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setSelectedFiles = useSelectionStore((state) => state.setSelectedFiles);

  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const lastClickedRef = useRef(0);

  const { downloadSingleFile } = useFileDownload();

  useEffect(() => {
    if (!isHovered) {
      setIsMenuOpen(false);
    }
  }, [isHovered]);

  if (isSelectMode || (!isHovered && !isMenuOpen)) return null;

  const handleDelete = () => {
    const now = Date.now();

    if (now - lastClickedRef.current < 500 || isAnimating) return;

    lastClickedRef.current = now;
    setSelectedFiles([item]);
    openDrawer("delete", <DeleteDrawer />, {
      title: "Delete",
      placement: "bottom",
      size: "lg",
      backdrop: "blur",
    });
    setIsMenuOpen(false);
  };

  const handleDownload = async () => {
    const now = Date.now();

    if (now - lastClickedRef.current < 500) return;
    lastClickedRef.current = now;

    setIsMenuOpen(false);

    try {
      await downloadSingleFile(item);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dropdown isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownTrigger>
        <Button
          isIconOnly
          className="absolute top-2 right-2 z-20 bg-black/50 text-white"
          size="sm"
          variant="flat"
          onPress={() => setIsMenuOpen(true)}
        >
          <DotsThree size={20} weight="bold" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="File actions"
        onClose={() => setIsMenuOpen(false)}
      >
        {/* <DropdownItem
          key="view"
          onPress={() => {
            setSelectedFiles([item]);
            setIsMenuOpen(false);
          }}
        >
          View details
        </DropdownItem> */}
        <DropdownItem key="download" onPress={handleDownload}>
          Download
        </DropdownItem>
        {/* <DropdownItem key="share" onPress={() => setIsMenuOpen(false)}>
          Share
        </DropdownItem> */}
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onPress={handleDelete}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
