import { Terminal, Quote } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

export function AuthBanner() {
  const { t } = useI18n();

  return (
    <div className="hidden lg:flex flex-col justify-between px-8 lg:px-16 py-16 bg-surface-container-lowest border-r border-border relative overflow-hidden z-10 select-none">
      {/* Gradients */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary-container/10 to-transparent pointer-events-none blur-[100px]" />

      {/* Centered main marketing content */}
      <div className="my-auto max-w-xl space-y-6 z-20">
        <h1 className="font-display text-[48px] leading-[1.1] italic text-primary">
          {t("auth.elevateYourCraft")}
        </h1>
        <p className="font-body text-[18px] leading-[1.6] text-text-secondary">
          {t("banner.tagline")}
        </p>
      </div>

      {/* Testimonial & version pushed near the bottom */}
      <div className="max-w-xl space-y-8 mt-auto z-20">
        {/* Testimonial Quote */}
        <div className="border-l border-primary-container/50 pl-4 py-2">
          <Quote className="text-primary-container h-6 w-6 opacity-40 mb-2" />
          <p className="font-body italic text-[16px] text-text-secondary leading-relaxed mb-3">
            &ldquo;{t("banner.quote")}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
            <span className="font-body text-code-sm text-text-primary">
              {t("banner.quoteAuthor")}, <span className="text-text-secondary text-[13px]">{t("banner.quoteRole")}</span>
            </span>
          </div>
        </div>

        {/* System Version Prompt */}
        <div className="font-code text-code-sm text-secondary-container pt-6 flex items-center gap-2 text-text-secondary opacity-70">
          <Terminal className="h-4 w-4 text-primary-container" />
          <span>{t("banner.cliVersion")}</span>
        </div>
      </div>
    </div>
  );
}
