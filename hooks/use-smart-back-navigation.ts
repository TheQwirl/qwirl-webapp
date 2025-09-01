import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

interface NavigationState {
  canGoBack: boolean;
  isExternalEntry: boolean;
  previousPath: string | null;
  historyLength: number;
}

const MAX_HISTORY_LENGTH = 10;

export const useSmartBackNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
    isExternalEntry: false,
    previousPath: null,
    historyLength: 0,
  });

  const pathHistory = useRef<string[]>([]);
  const initialized = useRef(false);

  // Detects whether the page was opened externally (new tab, bookmark, etc.)
  const detectExternalEntry = () => {
    const historyLen = window.history.length;
    const hasReferrer = Boolean(document.referrer);
    const isInternalReferrer =
      hasReferrer && document.referrer.includes(window.location.origin);
    const isDirectEntry = historyLen <= 2 && !isInternalReferrer;
    return { isDirectEntry, isInternalReferrer, historyLen };
  };

  // Initialize on first render
  useEffect(() => {
    if (typeof window === "undefined" || initialized.current) return;

    const { isDirectEntry, isInternalReferrer, historyLen } =
      detectExternalEntry();

    pathHistory.current = [pathname];

    setNavigationState({
      canGoBack: historyLen > 1 || isInternalReferrer,
      isExternalEntry: isDirectEntry,
      previousPath: null,
      historyLength: historyLen,
    });

    initialized.current = true;
  }, [pathname]);

  // Track navigation changes
  useEffect(() => {
    if (!initialized.current) return;

    const historyArr = pathHistory.current;
    const lastPath = historyArr[historyArr.length - 1];

    if (lastPath !== pathname) {
      const prevPath = lastPath ?? null;
      historyArr.push(pathname);

      if (historyArr.length > MAX_HISTORY_LENGTH) {
        historyArr.splice(0, historyArr.length - MAX_HISTORY_LENGTH);
      }

      setNavigationState((prev) => ({
        ...prev,
        previousPath: prevPath,
        canGoBack: true,
        historyLength: window.history.length,
      }));
    }
  }, [pathname]);

  const goBack = useCallback(
    (fallbackPath = "/feed") => {
      if (typeof window === "undefined") return;

      if (!navigationState.isExternalEntry && window.history.length > 1) {
        router.back();
        return;
      }

      const prevPath = pathHistory.current[pathHistory.current.length - 2];
      if (prevPath && prevPath !== pathname) {
        router.push(prevPath);
        return;
      }

      router.push(fallbackPath);
    },
    [pathname, router, navigationState.isExternalEntry]
  );

  return {
    ...navigationState,
    goBack,
    pathHistory: pathHistory.current,
  };
};
