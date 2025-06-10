"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Trash } from "@phosphor-icons/react";

import { TextureContainer } from "@/components/ui/texture-container";
import { useDrawerStore } from "@/stores/drawer-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useFileDelete } from "@/hooks/use-file-delete";

type DeleteFlag = "app" | "both";

export function DeleteDrawer() {
  const [deleteFlag, setDeleteFlag] = useState<DeleteFlag>("both");

  const selectedFiles = useSelectionStore((state) => state.selectedFiles);

  const { isDeleting, performDelete } = useFileDelete();

  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const handleDeleteOptionChange = (value: React.Key) => {
    setDeleteFlag(value as DeleteFlag);
  };

  const handleCancel = () => {
    closeDrawer();
  };

  const handleConfirmDelete = async () => {
    await performDelete(deleteFlag);
  };

  return (
    <TextureContainer className="space-y-6 p-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
          <Trash className="text-red-600 dark:text-red-400" size={24} />
        </div>
        <h2 className="text-lg font-medium">Confirm Delete</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to delete {selectedFiles.length} file
          {selectedFiles.length !== 1 ? "s" : ""}? This action cannot be undone.
        </p>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4">
        <RadioGroup
          label="Delete options"
          orientation="vertical"
          value={deleteFlag}
          onValueChange={handleDeleteOptionChange}
        >
          <Radio
            classNames={{
              base: "max-w-full",
              wrapper:
                "bg-white dark:bg-zinc-900 group-data-[selected=true]:bg-primary group-data-[selected=true]:dark:bg-primary/50",
              label: "text-sm font-medium text-zinc-900 dark:text-zinc-100",
              description: "text-xs text-zinc-500 dark:text-zinc-400",
            }}
            description="Files will remain available in Slack"
            value="app"
          >
            Delete from SlackShots only
          </Radio>
          <Radio
            classNames={{
              base: "max-w-full",
              wrapper:
                "bg-white dark:bg-zinc-900 group-data-[selected=true]:bg-primary group-data-[selected=true]:dark:bg-primary/50",
              label: "text-sm font-medium text-zinc-900 dark:text-zinc-100",
              description: "text-xs text-zinc-500 dark:text-zinc-400",
            }}
            description="Files will be permanently removed from both platforms"
            value="both"
          >
            Delete from Slack and SlackShots
          </Radio>
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button color="default" variant="flat" onPress={handleCancel}>
          Cancel
        </Button>
        <Button
          color="danger"
          isLoading={isDeleting}
          variant="solid"
          onPress={handleConfirmDelete}
        >
          Delete Files
        </Button>
      </div>
    </TextureContainer>
  );
}
