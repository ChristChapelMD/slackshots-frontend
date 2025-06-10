"use client";

import { Check } from "@phosphor-icons/react";
import { Select, SelectItem } from "@heroui/select";

import { TextureContainer } from "@/components/ui/texture-container";
import { useUploadFormStore } from "@/stores/upload-form-store";

type SharedSelection =
  | "all"
  | (Set<React.Key> & {
      anchorKey?: string;
      currentKey?: string;
    });

const fileTypes = [
  { value: ".jpg", label: "JPG" },
  { value: ".jpeg", label: "JPEG" },
  { value: ".png", label: "PNG" },
  { value: ".gif", label: "GIF" },
  { value: ".webp", label: "WEBP" },
];

export function FileTypeSelector() {
  const uploadFormState = useUploadFormStore((state) => state.formState);
  const updateUploadForm = useUploadFormStore((state) => state.updateForm);

  const selectedKeys = new Set(uploadFormState.fileTypes);

  const handleSelectionChange = (keys: SharedSelection) => {
    if (keys === "all") {
      updateUploadForm({ fileTypes: fileTypes.map((type) => type.value) });
    } else {
      const selected = Array.from(keys) as string[];

      updateUploadForm({ fileTypes: selected });
    }
  };

  return (
    <TextureContainer className="w-full">
      <Select
        disallowEmptySelection
        className="w-full"
        classNames={{
          trigger: "bg-white dark:bg-zinc-900 rounded-sm px-4 py-8",
          listbox:
            "bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-md",
          base: "w-full",
          label: "text-zinc-500 dark:text-zinc-300 font-medium mb-1",
          innerWrapper: "bg-transparent h-full flex items-center",
          value: "flex items-center",
          selectorIcon: "h-5 w-5",
        }}
        items={fileTypes}
        label="Select file types"
        listboxProps={{
          itemClasses: {
            base: "text-zinc-800 dark:text-zinc-200 data-[hover=true]:bg-zinc-100 data-[hover=true]:dark:bg-zinc-800 px-4 h-[48px] flex items-center",
            selectedIcon: "text-blue-500 dark:text-blue-400",
          },
        }}
        placeholder="Select file types"
        renderValue={(items) => {
          return items.length > 0
            ? `${items.length} file type${items.length > 1 ? "s" : ""} selected`
            : "Select file types";
        }}
        selectedKeys={uploadFormState.fileTypes}
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
      >
        {(type) => (
          <SelectItem key={type.value} textValue={type.label}>
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded border border-gray-400 flex items-center justify-center ${
                  selectedKeys.has(type.value)
                    ? "bg-blue-600 border-blue-600"
                    : ""
                }`}
              >
                {selectedKeys.has(type.value) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span>{type.label}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    </TextureContainer>
  );
}
