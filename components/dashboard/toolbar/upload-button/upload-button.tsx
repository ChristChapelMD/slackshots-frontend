"use client";

import { Button } from "@heroui/button";

import { useDrawerStore } from "@/stores/drawer-store";
import { TextureContainer } from "@/components/ui/texture-container";
import { useUploadProcessStore } from "@/stores/upload-process-store";
import { useUploadFormStore } from "@/stores/upload-form-store";
import { cn } from "@/lib/utils";

export function UploadButton() {
  const files = useUploadFormStore((state) => state.formState.files);
  const channel = useUploadFormStore((state) => state.formState.channel);
  const isUploading = useUploadProcessStore((state) => state.isUploading);
  const startUpload = useUploadProcessStore((state) => state.startUpload);
  const isOpen = useDrawerStore((state) => state.isOpen);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  const isAnimating = useDrawerStore((state) => state.isAnimating);

  const handleUpload = () => {
    startUpload();
    closeDrawer();
  };

  const isDrawerOpen = isOpen || isAnimating;
  const isDisabled = !files || !channel || isUploading;

  return (
    <TextureContainer className="w-full hover:bg">
      <Button
        aria-busy={isUploading}
        aria-live={isUploading ? "polite" : "off"}
        className={cn(
          "focus-visible-inset w-full px-4 py-2",
          isDrawerOpen ? "opacity-10 hover:bg-white dark:bg-zinc-900" : "",
          isDisabled
            ? "bg-white dark:bg-zinc-900"
            : "animate-rainbow group relative bg-[length:200%] text-primary-background",
          !isDisabled &&
            "dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
          !isDisabled &&
            "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:[filter:blur(calc(0.8*1rem))]",
        )}
        isDisabled={isDisabled}
        isLoading={isUploading}
        variant="shadow"
        onPress={handleUpload}
      >
        {isUploading ? (
          <p className="font-medium">Uploading...</p>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full">
            <span
              className={cn(
                "transition-all duration-300 ease-in-out",
                isDisabled
                  ? "opacity-0 transform -translate-x-4 scale-0"
                  : "opacity-100 transform translate-x-0 scale-100",
                "text-lg",
              )}
            >
              🚀
            </span>
            <span className="font-medium mr-8">Upload</span>
          </div>
        )}
      </Button>
    </TextureContainer>
  );
}
