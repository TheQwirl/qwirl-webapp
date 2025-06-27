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
