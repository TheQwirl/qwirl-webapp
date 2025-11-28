import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

/**
 * Safely converts a string to a number, returning a fallback value if the conversion fails.
 * @param value - The string value to convert.
 * @param fallback - The fallback number to return if conversion fails or if the string is empty.
 * @returns The converted number or the fallback value.
 */
export function safeToNumber(
  value: string,
  fallback: number | null = null
): number | null {
  const trimmed = value.trim();

  if (trimmed === "") return fallback;

  const num = Number(trimmed);

  return Number.isFinite(num) ? num : fallback;
}

export function queryToString(params: Record<string, string> | null): string {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return queryString ? `?${queryString}` : "";
}

export const generateInitialPollOptionId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2, 7);

export const getUnimplementedMessage = (feature: string) => {
  return `The ${feature} feature is not yet implemented. Coming very soon!`;
};

export const getFirstName = (fullName?: string | null) => {
  if (!fullName?.trim()) return null;
  const firstName = fullName?.split(" ")?.[0]?.trim();
  return firstName || null;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

/**
 * Attempts to share a URL using the Web Share API and falls back to copying
 * the URL to the clipboard. This is a small convenience wrapper that callers
 * can use from client-side code to unify sharing behaviour.
 *
 * Returns a result string describing what happened:
 * - "shared" when navigator.share successfully completed
 * - "copied" when the URL was copied to the clipboard
 * - "unsupported" when neither API is available in the environment
 * - { error: string } when an unexpected error occurred
 */
export async function shareOrCopy(
  url: string,
  title?: string
): Promise<"shared" | "copied" | "unsupported" | { error: string }> {
  try {
    if (typeof navigator === "undefined") return "unsupported";

    // Prefer the Web Share API when available. Use a typed navigator alias to
    // avoid `any` and satisfy lint rules.
    type NavigatorWithShare = Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };
    const nav = navigator as NavigatorWithShare;
    if (typeof nav.share === "function") {
      // Some environments may not have `document` (SSR) — this function should be
      // called from client code only. We still guard access just in case.
      await nav.share({
        title:
          title ??
          (typeof document !== "undefined" ? document.title : undefined),
        url,
      });
      return "shared";
    }

    // Fallback to clipboard if available
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(url);
      return "copied";
    }

    return "unsupported";
  } catch (err: unknown) {
    // Normalize the error to a simple object for callers to handle
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  }
}
