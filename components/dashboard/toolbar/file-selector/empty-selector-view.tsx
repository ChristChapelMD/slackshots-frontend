import { motion } from "framer-motion";

import { SelectorIcon } from "./selector-icon";

import { getAnimationVariants } from "@/lib/animation-utils";

interface EmptySelectorViewProps {
  activeTab: "files" | "folder";
  slideDirection: number;
}

export function EmptySelectorView({
  activeTab,
  slideDirection,
}: EmptySelectorViewProps) {
  const variants = getAnimationVariants(false);

  return (
    <motion.div
      key={`${activeTab}-empty`}
      animate="animate"
      className="flex flex-col items-center text-center"
      custom={slideDirection}
      exit="exit"
      initial="initial"
      variants={variants}
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full shadow-inner border-b-small border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
        <SelectorIcon activeTab={activeTab} isSelected={false} />
      </div>
      <p className="font-medium">
        {activeTab === "files"
          ? "Click to select files"
          : "Click to select a folder"}
      </p>
    </motion.div>
  );
}
