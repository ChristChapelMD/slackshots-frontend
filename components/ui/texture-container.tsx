import React from "react";

import { cn } from "@/lib/utils";

interface TextureContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TextureContainer({
  className,
  children,
  ...props
}: TextureContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        "border border-neutral-300/60 dark:border-zinc-800/70",
        "bg-zinc-100 dark:bg-zinc-800",
        "flex flex-col",
        className,
      )}
      {...props}
    >
      <div className="rounded-xl border border-neutral-300/40 dark:border-zinc-900/70 flex-1 flex flex-col min-h-0">
        <div className="w-full h-full rounded-xl border border-white/50 dark:border-zinc-800/50 flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
