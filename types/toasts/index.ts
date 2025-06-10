"use client";
import { useToast } from "@heroui/toast";

export type ToastStatus = "info" | "success" | "warning" | "error" | "default";
export type ToastSeverity = NonNullable<
  ReturnType<typeof useToast>["severity"]
>;
export type ToastColor = NonNullable<ReturnType<typeof useToast>["color"]>;

export interface BaseToastConfig {
  title?: NonNullable<ReturnType<typeof useToast>["title"]>;
  description?: React.ReactNode | ((error: unknown) => React.ReactNode);
  status?: ToastStatus;
  severity?: ToastSeverity;
  color?: ToastColor;
  timeout?: number;
  enabled?: boolean;
}

export interface ToastHandlerOptions {
  disableDefault?: boolean;
  showOnLastRetryOnly?: boolean;
  customLogic?: (error: unknown) => void;
}

export interface ToastOptions {
  onError?: BaseToastConfig & ToastHandlerOptions;
  onSuccess?: BaseToastConfig & ToastHandlerOptions;
}
