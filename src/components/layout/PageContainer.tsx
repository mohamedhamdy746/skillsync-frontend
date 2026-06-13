import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * PageContainer — max-width wrapper with atmospheric padding.
 * Per DESIGN.md: max 1280px, 24px gutters, 32px+ padding.
 */

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-container px-gutter py-8 md:py-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
