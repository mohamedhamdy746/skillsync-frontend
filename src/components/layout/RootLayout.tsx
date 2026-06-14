import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "@/components/ui";
import { LoadingFallback } from "@/components/feedback";

/**
 * RootLayout — App shell wrapping all routes.
 *
 * Structure:
 *   Navbar
 *   <main> → <Suspense> → <Outlet /> (page content)
 *   Footer
 *   BackToTop
 */
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
