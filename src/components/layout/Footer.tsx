import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/i18n";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-16 border-t border-outline-variant bg-surface-container-lowest w-full">
      <div className="mx-auto max-w-7xl h-full px-6 lg:px-12">
        <div className="flex h-full items-center justify-between">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-display text-[20px] italic text-primary block"
          >
            SkillSync
          </Link>
          <span className="text-[12px] text-secondary opacity-80 font-body">
            {t("footer.copyright").replace("{year}", String(currentYear))}
          </span>
        </div>

        {/* Policy Links */}
        <nav className="flex gap-4 md:gap-8">
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            {t("footer.privacy")}
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            {t("footer.terms")}
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            {t("footer.cookie")}
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            {t("footer.contact")}
          </a>
        </nav>
        </div>
      </div>
    </footer>
  );
}
