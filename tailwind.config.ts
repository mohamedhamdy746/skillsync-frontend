import type { Config } from "tailwindcss";

/**
 * SkillSync Tailwind Configuration
 *
 * Design tokens sourced from DESIGN.md ("Academic Ember" theme).
 * This file is referenced from src/index.css via @config.
 *
 * @see DESIGN.md for full design system documentation.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      /* ─── Colors ─────────────────────────────────────────── */
      colors: {
        canvas: "#0b0a09",
        surface: {
          DEFAULT: "#161412",
          dim: "#121413",
          bright: "#383939",
          "container-lowest": "#0d0e0e",
          "container-low": "#1a1c1c",
          container: "#1e2020",
          "container-high": "#292a2a",
          "container-highest": "#343535",
          tint: "#ffb4a3",
          variant: "#343535",
        },
        ember: "#ff5e3a",
        primary: {
          DEFAULT: "#ffb4a3",
          container: "#ff5e3a",
          fixed: "#ffdad2",
          "fixed-dim": "#ffb4a3",
        },
        "on-primary": {
          DEFAULT: "#630f00",
          container: "#5c0e00",
          fixed: "#3d0600",
          "fixed-variant": "#8b1a00",
        },
        "inverse-primary": "#b42907",
        secondary: {
          DEFAULT: "#cbc5c2",
          container: "#4c4846",
          fixed: "#e8e1dd",
          "fixed-dim": "#cbc5c2",
        },
        "on-secondary": {
          DEFAULT: "#33302e",
          container: "#bdb7b4",
          fixed: "#1d1b19",
          "fixed-variant": "#494644",
        },
        tertiary: {
          DEFAULT: "#cac6c3",
          container: "#979391",
          fixed: "#e6e1df",
          "fixed-dim": "#cac6c3",
        },
        "on-tertiary": {
          DEFAULT: "#32302f",
          container: "#2e2c2b",
          fixed: "#1d1b1a",
          "fixed-variant": "#484645",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#ffdad6",
        },
        "on-surface": {
          DEFAULT: "#e3e2e1",
          variant: "#e3beb6",
        },
        "inverse-surface": "#e3e2e1",
        "inverse-on-surface": "#2f3130",
        outline: {
          DEFAULT: "#aa8982",
          variant: "#5a413b",
        },
        "text-primary": "#f9f8f7",
        "text-secondary": "#a3a19f",
        border: "#2a2826",
      },

      /* ─── Typography ─────────────────────────────────────── */
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Hanken Grotesk", "sans-serif"],
        code: ["Geist", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-lg-mobile": [
          "32px",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        "body-lg": [
          "18px",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        "body-md": [
          "16px",
          { lineHeight: "1.5", fontWeight: "400" },
        ],
        "code-sm": [
          "14px",
          { lineHeight: "1.5", fontWeight: "400" },
        ],
        "label-caps": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" },
        ],
      },

      /* ─── Border Radius ──────────────────────────────────── */
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

      /* ─── Spacing ────────────────────────────────────────── */
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
      },

      /* ─── Shadows & Glows ────────────────────────────────── */
      boxShadow: {
        ember: "0 0 20px 0 rgba(255, 94, 58, 0.15)",
        "ember-md": "0 0 30px 0 rgba(255, 94, 58, 0.2)",
      },

      /* ─── Backdrop Blur ──────────────────────────────────── */
      backdropBlur: {
        modal: "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
