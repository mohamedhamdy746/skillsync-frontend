import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card component — DESIGN.md specs:
 *   - Surface #161412 with 1px border #2a2826
 *   - xl border radius (0.75rem)
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** If true, adds the ember accent bar on the left edge (for "High Priority" items). */
  accentBar?: boolean;
}

export function Card({ children, accentBar, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        accentBar && "border-l-2 border-l-ember",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
