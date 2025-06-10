import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
  QueryFunction,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useCallback } from "react";

import { ToastOptions } from "@/types/toasts";
import { toastConfig } from "@/config/toasts";

interface UseToastQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryFn"
  > {
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  toast?: ToastOptions;
  maxRetries?: number;
}

const failureCounts = new Map<string, number>();
const backoffResetMS = 10000;

const statusMap = toastConfig.statusMap;

export function useToastQuery<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseToastQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const keyStr = JSON.stringify(options.queryKey);
  const maxRetries = options.maxRetries ?? 2;

  const wrappedFn = useCallback(
    async (context: any) => {
      try {
        const result = await options.queryFn(context);

        failureCounts.delete(keyStr);

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
        const count = (failureCounts.get(keyStr) || 0) + 1;

        failureCounts.set(keyStr, count);
        const toastError = options.toast?.onError;

        const shouldShow =
          toastError &&
          (toastError.showOnLastRetryOnly === false ||
            count > ((options.retry as number) ?? maxRetries));

        if (toastError && toastError.enabled !== false && shouldShow) {
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
          setTimeout(() => failureCounts.delete(keyStr), backoffResetMS);
        }

        throw error;
      }
    },
    [options.queryFn, keyStr, options.retry, maxRetries, options.toast],
  );

  const { ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryFn: wrappedFn,
    retry: options.retry ?? maxRetries,
    retryDelay:
      options.retryDelay ??
      ((attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)),
  });
}
