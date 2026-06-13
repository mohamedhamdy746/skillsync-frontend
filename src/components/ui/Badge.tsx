import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component — DESIGN.md mentor badge style.
 * Small, uppercase labels with high letter spacing.
 */

type BadgeVariant = "default" | "ember" | "success" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-container-highest text-text-secondary",
  ember: "bg-ember/15 text-ember",
  success: "bg-green-900/20 text-green-400",
  warning: "bg-yellow-900/20 text-yellow-400",
  error: "bg-error-container/20 text-error",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-1",
        "font-body text-label-caps uppercase tracking-[0.1em]",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
