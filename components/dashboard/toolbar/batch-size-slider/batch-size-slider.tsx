"use client";

import { useState } from "react";
import { Slider } from "@heroui/slider";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Stack, StackPlus, StackMinus } from "@phosphor-icons/react";

import { TextureContainer } from "@/components/ui/texture-container";
import { useDrawerStore } from "@/stores/drawer-store";
import { useDebounceStoreUpdate } from "@/hooks/use-debounce-store-update";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { useUploadProcessStore } from "@/stores/upload-process-store";

export function BatchSizeSlider() {
  const updateUploadForm = useUploadFormStore((state) => state.updateForm);
  const initial = useUploadFormStore(
    (state) => state.formState.messageBatchSize,
  );
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const [localVal, setLocalVal] = useState(initial);

  const { run: updateDebounce } = useDebounceStoreUpdate<number>(
    (val) => updateUploadForm({ messageBatchSize: val }),
    300,
  );

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  return (
    <TextureContainer className="w-full">
      <Card className="w-full rounded-xl" isDisabled={isDisabled}>
        <CardHeader className="flex font-medium gap-2 items-center py-2">
          <Stack aria-hidden="true" size={20} />
          <h3>Batch Size</h3>
        </CardHeader>
        <CardBody className="pb-4">
          <Slider
            aria-label="Select message batch size"
            className="slider-visible-focus-fix w-full"
            color="foreground"
            endContent={
              <StackPlus className="text-zinc-500 dark:text-zinc-300" />
            }
            formatOptions={{ style: "decimal" }}
            isDisabled={isDisabled}
            marks={[
              { value: 1, label: "1" },
              { value: 7, label: "7" },
              { value: 14, label: "14" },
            ]}
            maxValue={14}
            minValue={1}
            showTooltip={true}
            size="sm"
            startContent={
              <StackMinus className="text-zinc-500 dark:text-zinc-300" />
            }
            step={1}
            value={localVal}
            onChange={(val) => {
              const value = val as number;

              setLocalVal(value);
              updateDebounce(value);
            }}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-3 px-1">
            {localVal === 1
              ? "Upload 1 image per message"
              : `Upload ${localVal} images per message`}
          </p>
        </CardBody>
      </Card>
    </TextureContainer>
  );
}
