import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — resolves conflicts (e.g. `p-2 p-4` → `p-4`).
 * Combines `clsx` conditional logic with `tailwind-merge` deduplication.
 *
 * @example cn("p-4", isActive && "bg-ember", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a Date to a locale-friendly date string.
 * TODO: Integrate with i18n locale.
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a Date to a locale-friendly time string.
 * TODO: Integrate with i18n locale.
 */
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a session range without exposing raw ISO timestamps.
 */
export function formatSessionRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} • ${formatTime(start)} - ${formatTime(end)}`;
}
