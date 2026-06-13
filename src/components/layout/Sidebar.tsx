import { cn } from "@/lib/utils";

/**
 * Sidebar — dashboard side navigation.
 *
 * TODO: Implement with:
 * - Role-aware navigation links
 * - Active route highlighting
 * - Collapsible on mobile
 */

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 border-r border-border bg-surface-container-low p-4",
        className,
      )}
    >
      {/* TODO: Sidebar navigation items */}
      <nav className="flex flex-col gap-2">
        <p className="font-body text-label-caps uppercase tracking-widest text-text-secondary">
          Navigation
        </p>
      </nav>
    </aside>
  );
}
