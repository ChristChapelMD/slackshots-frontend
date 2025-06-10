"use client";

import { useEffect, useMemo, useRef } from "react";

export function useDebounceStoreUpdate<T>(
  updater: (value: T) => void,
  delay = 300,
) {
  const latestUpdater = useRef(updater);
  const latestArgs = useRef<T | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    latestUpdater.current = updater;
  }, [updater]);

  const debouncedFn = useMemo(() => {
    const run = (value: T) => {
      latestArgs.current = value;
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        if (latestArgs.current !== null) {
          latestUpdater.current(latestArgs.current);
          latestArgs.current = null;
        }
      }, delay);
    };

    const flush = () => {
      if (timer.current && latestArgs.current !== null) {
        clearTimeout(timer.current);
        latestUpdater.current(latestArgs.current);
        timer.current = null;
        latestArgs.current = null;
      }
    };

    const cancel = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        latestArgs.current = null;
      }
    };

    return { run, flush, cancel };
  }, [delay]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
