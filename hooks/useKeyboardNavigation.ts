// hooks/useKeyboardNavigation.ts
import { useEffect } from "react";

type KeyMap = {
  ArrowLeft?: () => void;
  ArrowRight?: () => void;
  ArrowUp?: () => void;
  ArrowDown?: () => void;
  [key: string]: (() => void) | undefined;
};

export function useKeyboardNavigation(keyMap: KeyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const fn = keyMap[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyMap, enabled]);
}
