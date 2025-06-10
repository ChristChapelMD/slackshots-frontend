"use client";

import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { SelectModeActionIcons } from "@/components/dashboard/header/select-mode/select-mode-button-icons";
import { TextureContainer } from "@/components/ui/texture-container";
import { useDrawerStore } from "@/stores/drawer-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useUploadProcessStore } from "@/stores/upload-process-store";

const { viewFiles } = SelectModeActionIcons;

export function ViewSelectedButton() {
  const isSelectMode = useSelectionStore((state) => state.isSelectMode);
  const selectedFiles = useSelectionStore((state) => state.selectedFiles);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const isAnimating = useDrawerStore((state) => state.isAnimating);

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  return (
    <AnimatePresence mode="popLayout">
      {isSelectMode && (
        <motion.div
          key="select-action-buttons"
          layout
          animate={{
            filter: "blur(0px)",
            opacity: 1,

            rotate: 0,
            scale: 1,
            x: 0,
          }}
          exit={{
            filter: "blur(4px)",
            opacity: 0,

            transition: {
              duration: 0.2,
              ease: "easeIn",
              type: "tween",
            },
            x: 20,
          }}
          initial={{
            filter: "blur(4px)",
            opacity: 0,

            rotate: -15,
            scale: 0.8,
            x: 20,
          }}
          transition={{
            damping: 15,
            delay: 0.05,
            duration: 0.2,
            ease: "easeOut",
            mass: 1,
            stiffness: 400,
            type: "spring",
          }}
        >
          <Badge
            aria-label={`${selectedFiles.length} files selected.`}
            className={
              isSelectMode && selectedFiles.length <= 0 ? "hidden" : ""
            }
            color="secondary"
            content={selectedFiles.length}
            isDot={isDisabled}
            size="md"
            variant="shadow"
          >
            <TextureContainer>
              <Tooltip content={viewFiles.tooltipText}>
                <Button
                  isIconOnly
                  className="focus-visible-inset group bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
                  isDisabled={isDisabled || selectedFiles.length <= 0}
                  variant="shadow"
                >
                  {viewFiles.icon()}
                </Button>
              </Tooltip>
            </TextureContainer>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
