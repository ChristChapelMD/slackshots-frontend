import { useEffect, useRef, useCallback } from "react";

export function useClickHandler(
  onSingleClick: () => void,
  onDoubleClick: () => void,
  delay = 250,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      onDoubleClick();
    } else {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        onSingleClick();
      }, delay);
    }
  }, [onSingleClick, onDoubleClick, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return handleClick;
}
