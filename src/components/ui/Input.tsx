import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Input component styled per DESIGN.md:
 *   - Surface bg with subtle bottom border
 *   - Focus: border changes to ember with slight lift
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-label-caps uppercase tracking-widest text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded bg-surface px-4 py-3 font-body text-body-md text-text-primary",
            "border-b-2 border-text-secondary/30 outline-none",
            "transition-all duration-200",
            "placeholder:text-text-secondary/50",
            "focus:border-ember focus:-translate-y-px",
            error && "border-error",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="font-body text-code-sm text-error">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
