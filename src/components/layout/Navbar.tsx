import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useI18n } from "@/i18n/i18n";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Navbar — editorial-style header matching the Academic Ember design reference.
 *
 * - Large italic serif brand
 * - Minimal nav links (hidden on mobile)
 * - "Sign In" as uppercase label-caps
 * - Sticky with subtle border
 * - i18n Language Toggle (AR / EN)
 */
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, locale, setLocale } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-border bg-surface-dim">
      <div className="mx-auto h-full max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <div className="flex h-full items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            className="font-display text-3xl md:text-4xl italic text-primary"
          >
            SkillSync
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/"
              className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
            >
              {t("nav.discover")}
            </Link>

            {isAuthenticated && user && (
              <>
                {user.role === "STUDENT" && (
                  <Link
                    to="/dashboard"
                    className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}
                {user.role === "MENTOR" && (
                  <Link
                    to="/mentor/dashboard"
                    className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                  >
                    {t("nav.admin")}
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
                >
                  {t("nav.profile")}
                </Link>
              </>
            )}
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-body text-label-caps uppercase tracking-widest text-[11px] transition-colors duration-200 border border-border/80 px-2 py-1 rounded"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{locale === "en" ? "العربية" : "English"}</span>
            </button>

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
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block font-body text-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("nav.signIn")}
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
            {t("nav.discover")}
          </Link>

          {isAuthenticated && user && (
            <>
              {user.role === "STUDENT" && (
                <Link
                  to="/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
              )}
              {user.role === "MENTOR" && (
                <Link
                  to="/mentor/dashboard"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.admin")}
                </Link>
              )}
              <Link
                to="/profile"
                className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.profile")}
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
              {t("nav.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
