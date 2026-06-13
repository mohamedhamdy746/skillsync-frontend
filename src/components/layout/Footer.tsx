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
    <footer className="border-t border-outline-variant bg-surface-container-lowest w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-margin-mobile md:px-margin-desktop py-12 max-w-container mx-auto">
        {/* Brand & Copyright */}
        <div className="mb-8 md:mb-0">
          <Link
            to="/"
            className="font-display text-[24px] italic text-primary mb-2 block"
          >
            SkillSync
          </Link>
          <p className="font-body text-body-md text-secondary opacity-80">
            © {currentYear} SkillSync Academic Mentorship. All rights reserved.
          </p>
        </div>

        {/* Policy Links */}
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8">
          <a
            href="#"
            className="text-secondary font-body text-body-md hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-secondary font-body text-body-md hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-secondary font-body text-body-md hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Cookie Policy
          </a>
          <a
            href="#"
            className="text-secondary font-body text-body-md hover:text-primary-container transition-colors opacity-80 hover:opacity-100"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}
