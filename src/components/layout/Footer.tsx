import { Link } from "react-router-dom";

/**
 * Footer — matches the Academic Ember reference design.
 *
 * - Italic serif brand at 24px
 * - Copyright text
 * - Policy nav links with opacity hover
 * - surface-container-lowest background
 */
export function Footer() {
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
            © {currentYear} SkillSync.
          </span>
        </div>

        {/* Policy Links */}
        <nav className="flex gap-4 md:gap-8">
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Cookie Policy
          </a>
          <a
            href="#"
            className="text-secondary font-body text-[13px] hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Contact Us
          </a>
        </nav>
        </div>
      </div>
    </footer>
  );
}
