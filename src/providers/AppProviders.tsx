import type { ReactNode } from "react";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/query-client";
import { AuthInitializer } from "./AuthInitializer";
import { useI18n } from "@/i18n/i18n";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#161412",
              color: "#f9f8f7",
              border: "1px solid #2a2826",
              borderRadius: "0.5rem",
              fontFamily: "Hanken Grotesk, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#ff5e3a",
                secondary: "#0b0a09",
              },
            },
            error: {
              iconTheme: {
                primary: "#ffb4ab",
                secondary: "#690005",
              },
            },
          }}
        />
      </AuthInitializer>
    </QueryClientProvider>
  );
}
