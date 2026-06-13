import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder — animates a shimmer effect.
 * Use while data is being fetched from the API.
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-surface-container-high",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Pre-composed skeleton for a text line. */
export function SkeletonLine({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/** Pre-composed skeleton for an avatar circle. */
export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-12 w-12 rounded-full", className)} />;
}

/** Pre-composed skeleton for a card. */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 space-y-4",
        className,
      )}
    >
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}
