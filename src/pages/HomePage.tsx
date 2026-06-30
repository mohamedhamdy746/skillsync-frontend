import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { LoadingFallback } from "@/components/feedback";

const LandingPage = lazy(() => import("@/pages/LandingPage"));

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    if (user?.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "MENTOR") {
      return <Navigate to="/mentor/dashboard" replace />;
    }
    if (user?.role === "STUDENT") {
      return <Navigate to="/discover" replace />;
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LandingPage />
    </Suspense>
  );
}
