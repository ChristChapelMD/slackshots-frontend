import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  MutationKey,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useCallback } from "react";

import { ToastOptions } from "@/types/toasts";
import { toastConfig } from "@/config/toasts";

interface UseToastMutationOptions<TData, TError, TVariables, TContext>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  > {
  mutationFn: (variables: TVariables) => Promise<TData>;
  toast?: ToastOptions;
}

const statusMap = toastConfig.statusMap;

export function useToastMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseToastMutationOptions<TData, TError, TVariables, TContext>,
  mutationKey?: MutationKey,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const wrappedMutationFn = useCallback(
    async (variables: TVariables) => {
      try {
        const result = await options.mutationFn(variables);

        const toastSuccess = options.toast?.onSuccess;

        if (toastSuccess && toastSuccess.enabled !== false) {
          const { severity, color } =
            statusMap[toastSuccess.status ?? "default"];

          if (!toastSuccess.disableDefault) {
            addToast({
              title: toastSuccess.title ?? "Success",
              description:
                typeof toastSuccess.description === "function"
                  ? toastSuccess.description(result)
                  : (toastSuccess.description ??
                    "Operation completed successfully"),
              severity: toastSuccess.severity ?? severity,
              color: toastSuccess.color ?? color ?? "success",
              timeout: toastSuccess.timeout ?? 5000,
            });
          }

          toastSuccess.customLogic?.(result);
        }

        return result;
      } catch (error) {
        const toastError = options.toast?.onError;

        if (toastError && toastError.enabled !== false) {
          const { severity, color } = statusMap[toastError.status ?? "default"];

          if (!toastError.disableDefault) {
            addToast({
              title: toastError.title ?? "Error",
              description:
                typeof toastError.description === "function"
                  ? toastError.description(error)
                  : (toastError.description ?? "Something went wrong"),
              severity: toastError.severity ?? severity ?? "danger",
              color: toastError.color ?? color ?? "danger",
              timeout: toastError.timeout ?? 7000,
            });
          }

          toastError.customLogic?.(error);
        }

        throw error;
      }
    },
    [options.mutationFn, options.toast],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutationFn, ...restOptions } = options;

  return useMutation({
    ...restOptions,
    mutationKey,
    mutationFn: wrappedMutationFn,
  });
}
