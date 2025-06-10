"use client";

import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Plus } from "@phosphor-icons/react";

import { useDrawerStore } from "@/stores/drawer-store";
import { useChannels } from "@/hooks/use-channels";
import { useAddBot } from "@/hooks/use-add-bot";
import { TextureContainer } from "@/components/ui/texture-container";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { useUploadProcessStore } from "@/stores/upload-process-store";

export function ChannelSelector() {
  const { data: channelOptions = [], isLoading } = useChannels();
  const { mutate: addBotToChannel, isPending: isAddingBot } = useAddBot();

  const uploadFormState = useUploadFormStore((state) => state.formState);
  const updateUploadForm = useUploadFormStore((state) => state.updateForm);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const isAnimating = useDrawerStore((state) => state.isAnimating);
  const isOpen = useDrawerStore((state) => state.isOpen);

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = isDrawerOpen || isUploading;

  return (
    <TextureContainer className="w-full">
      <Select
        className="w-full"
        classNames={{
          trigger:
            "focus-visible-inset bg-white dark:bg-zinc-900 rounded-xl px-4 py-8",
          listbox:
            "bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-md",
          base: "w-full",
          label: "text-zinc-500 dark:text-zinc-300 font-medium mb-1",
          innerWrapper: "bg-transparent h-full flex items-center",
          value: "flex items-center",
          selectorIcon: "h-5 w-5",
        }}
        disabledKeys={channelOptions
          .filter((channel) => !channel.isMember)
          .map((channel) => channel.value)}
        isDisabled={isDisabled}
        isLoading={isLoading}
        items={channelOptions}
        label="Select a channel"
        listboxProps={{
          itemClasses: {
            base: "text-zinc-800 dark:text-zinc-200 data-[hover=true]:bg-zinc-100 data-[hover=true]:dark:bg-zinc-800 px-4 h-[48px] flex items-center",
            selectedIcon: "text-green-500 dark:text-green-400",
          },
        }}
        placeholder="Select a channel"
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="font-medium">
              {item.data?.label}
            </div>
          ));
        }}
        selectedKeys={uploadFormState.channel ? [uploadFormState.channel] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;

          updateUploadForm({ channel: selected });
        }}
      >
        {(channel) => (
          <SelectItem
            key={channel.value}
            endContent={
              !channel.isMember && (
                <Tooltip content="Add SlackShots to this channel">
                  <Button
                    isIconOnly
                    isLoading={
                      isAddingBot && channel.value === uploadFormState.channel
                    }
                    size="sm"
                    onPress={() => {
                      addBotToChannel(channel.value);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </Tooltip>
              )
            }
            textValue={channel.label}
          >
            {channel.label}
          </SelectItem>
        )}
      </Select>
    </TextureContainer>
  );
}
