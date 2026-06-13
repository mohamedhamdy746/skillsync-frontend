import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * EmptyState — displayed when a list has zero items.
 * Provides a visual placeholder with optional action.
 */

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-text-secondary/50">{icon}</div>
      )}
      <h3 className="font-display text-headline-md italic text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm font-body text-body-md text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
