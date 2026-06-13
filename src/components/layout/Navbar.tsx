import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Navbar — editorial-style header matching the Academic Ember design reference.
 *
 * - Large italic serif brand
 * - Minimal nav links (hidden on mobile)
 * - "Sign In" as uppercase label-caps
 * - Sticky with subtle border
 */
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface-dim w-full">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container mx-auto h-20">
        {/* Brand */}
        <Link
          to="/"
          className="font-display text-display-lg-mobile md:text-display-lg italic text-primary"
        >
          SkillSync
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
          >
            Discover
          </Link>

          {isAuthenticated && user && (
            <>
              {user.role === "STUDENT" && (
                <Link
                  to="/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "MENTOR" && (
                <Link
                  to="/mentor/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Auth Action */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="hidden md:block font-body text-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:block font-body text-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-on-surface-variant hover:text-primary transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "border-t border-outline-variant bg-surface-dim md:hidden",
          isMobileMenuOpen ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-4 px-margin-mobile py-6">
          <Link
            to="/"
            className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Discover
          </Link>

          {isAuthenticated && user && (
            <>
              {user.role === "STUDENT" && (
                <Link
                  to="/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user.role === "MENTOR" && (
                <Link
                  to="/mentor/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
