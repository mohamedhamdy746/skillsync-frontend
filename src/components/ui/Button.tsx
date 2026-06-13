import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button component with variants from DESIGN.md.
 *
 * Variants:
 *   primary   → bg-ember, text-canvas, bold
 *   secondary → transparent, 1px border, text-primary
 *   ghost     → no bg/border, text-secondary
 */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ember text-canvas font-bold hover:shadow-ember active:scale-[0.98] transition-all",
  secondary:
    "bg-transparent border border-text-secondary text-text-primary hover:border-ember hover:text-ember transition-colors",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary transition-colors",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-code-sm rounded",
  md: "px-5 py-2.5 text-body-md rounded",
  lg: "px-7 py-3 text-body-lg rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body transition-all focus-visible:outline-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
