import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useI18n } from "@/i18n/i18n";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-border bg-surface-dim">
      <div className="mx-auto h-full max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <div className="flex h-full items-center justify-between">

          {/* Brand */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="font-display text-3xl md:text-4xl italic text-primary"
          >
            SkillSync
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {!isAdmin && (
              <Link
                to="/"
                className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200"
              >
                {t("nav.discover")}
              </Link>
            )}

            {isAuthenticated && user && (
              <>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                      {t("nav.dashboard")}
                    </Link>
                    <Link to="/admin/mentors" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                      {t("nav.mentors")}
                    </Link>
                    <Link to="/admin/students" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                      {t("nav.students")}
                    </Link>
                    <Link to="/admin/stacks" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                      {t("nav.stacks")}
                    </Link>
                  </>
                )}
                {user.role === "STUDENT" && (
                  <Link to="/dashboard" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                    {t("nav.dashboard")}
                  </Link>
                )}
                {user.role === "MENTOR" && (
                  <Link to="/mentor/dashboard" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                    {t("nav.dashboard")}
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/profile" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors duration-200">
                    {t("nav.profile")}
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-body text-label-caps text-xs tracking-widest text-text-secondary hover:border-ember hover:text-ember transition-colors duration-200"
              aria-label="Toggle language">
              <Globe className="h-3.5 w-3.5" />
              <span>{locale === "en" ? "العربية" : "English"}</span>
            </button>

            <button onClick={toggleTheme}
              className="flex items-center justify-center rounded-full border border-border bg-surface p-2 text-text-secondary hover:border-ember hover:text-ember transition-colors duration-200"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <button onClick={handleLogout}
                className="hidden md:block font-body text-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                {t("nav.logout")}
              </button>
            ) : (
              <Link to="/login"
                className="hidden md:block font-body text-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                {t("nav.signIn")}
              </Link>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-on-surface-variant hover:text-primary transition-colors md:hidden"
              aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("border-t border-outline-variant bg-surface-dim md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
        <div className="flex flex-col gap-4 px-margin-mobile py-6">
          {!isAdmin && (
            <Link to="/" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav.discover")}
            </Link>
          )}

          {isAuthenticated && user && (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.dashboard")}
                  </Link>
                  <Link to="/admin/mentors" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.mentors")}
                  </Link>
                  <Link to="/admin/students" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.students")}
                  </Link>
                  <Link to="/admin/stacks" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.stacks")}
                  </Link>
                </>
              )}
              {user.role === "STUDENT" && (
                <Link to="/dashboard" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.dashboard")}
                </Link>
              )}
              {user.role === "MENTOR" && (
                <Link to="/mentor/dashboard" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.dashboard")}
                </Link>
              )}
              {!isAdmin && (
                <Link to="/profile" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.profile")}
                </Link>
              )}
            </>
          )}

          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="text-left text-on-surface-variant font-body text-body-md hover:text-primary transition-colors">
              {t("nav.logout")}
            </button>
          ) : (
            <Link to="/login" className="text-on-surface-variant font-body text-body-md hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
