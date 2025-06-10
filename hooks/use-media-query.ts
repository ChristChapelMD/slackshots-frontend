"use client";

import { useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

function getInitialState(query: string, defaultState?: boolean): boolean {
  if (defaultState !== undefined) {
    return defaultState;
  }
  if (isBrowser) {
    return window.matchMedia(query).matches;
  }

  return false;
}

export function useMediaQuery(query: string, defaultState = false): boolean {
  const [matches, setMatches] = useState(() =>
    getInitialState(query, defaultState),
  );

  useEffect(() => {
    if (!isBrowser) return;

    const mql = window.matchMedia(query);
    let mounted = true;

    const onChange = () => {
      if (!mounted) return;
      const match = mql.matches;

      setMatches(match);
    };

    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
    } else {
      (mql as any).addListener(onChange);
    }

    setMatches(mql.matches);

    return () => {
      mounted = false;
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", onChange);
      } else {
        (mql as any).removeListener(onChange);
      }
    };
  }, [query]);

  return matches;
}
