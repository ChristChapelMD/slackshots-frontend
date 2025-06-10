import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { SelectorIcon } from "@/components/dashboard/toolbar/file-selector/selector-icon";
import { getAnimationVariants } from "@/lib/animation-utils";

interface SelectedFilesViewProps {
  activeTab: "files" | "folder";
  fileCount: number;
  slideDirection: number;
  clearSelection: () => void;
  isDisabled: boolean;
}

export function SelectedFilesView({
  activeTab,
  fileCount,
  slideDirection,
  clearSelection,
  isDisabled,
}: SelectedFilesViewProps) {
  const getLabel = () => (activeTab === "files" ? "selected" : "from folder");
  const variants = getAnimationVariants(true);

  return (
    <motion.div
      key={`${activeTab}`}
      animate="animate"
      className="flex flex-col items-center text-center"
      custom={slideDirection}
      exit="exit"
      initial="initial"
      variants={variants}
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-100 dark:bg-green-800">
        <SelectorIcon isSelected activeTab={activeTab} />
      </div>
      <p className="mb-1 font-medium">
        {fileCount} file{fileCount !== 1 ? "s" : ""} {getLabel()}
      </p>
      <Button
        aria-label="Clear file selection"
        as={Chip}
        className="flex items-center"
        color="danger"
        isDisabled={isDisabled}
        size="sm"
        variant="light"
        onPress={clearSelection}
      >
        X Clear selection
      </Button>
    </motion.div>
  );
}
