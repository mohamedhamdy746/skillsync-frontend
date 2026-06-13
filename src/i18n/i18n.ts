import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

/**
 * Lightweight i18n system using Zustand.
 *
 * Structure:
 *   - Locale files are flat key-value JSON (src/i18n/locales/*.json)
 *   - `t()` function returns the translated string for a key
 *   - `setLocale()` switches language and updates <html dir> + <html lang>
 *   - Persists locale preference to localStorage
 *
 * Usage:
 *   const { t, locale, setLocale } = useI18n();
 *   <h1>{t("nav.discover")}</h1>
 *   <button onClick={() => setLocale("ar")}>العربية</button>
 */

type Locale = "en" | "ar";

type TranslationMap = Record<string, string>;

const translations: Record<Locale, TranslationMap> = { en, ar };

const RTL_LOCALES: Locale[] = ["ar"];

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale | null;
  return stored || "en";
}

function applyLocaleToDOM(locale: Locale) {
  const html = document.documentElement;
  html.lang = locale;
  html.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: getInitialLocale(),

  setLocale: (locale: Locale) => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    applyLocaleToDOM(locale);
    set({ locale });
  },

  t: (key: string): string => {
    const locale = get().locale;
    return translations[locale]?.[key] || translations.en[key] || key;
  },
}));

// Apply initial locale on module load
applyLocaleToDOM(getInitialLocale());
