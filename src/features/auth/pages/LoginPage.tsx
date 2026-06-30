import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { AuthBanner, LoginForm } from "../index";

export default function LoginPage() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "MENTOR") {
      return <Navigate to="/mentor/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 grid grid-cols-1 lg:grid-cols-2 bg-canvas text-on-surface">
      {/* Left Column: Brand & Identity */}
      <AuthBanner />

      {/* Right Column: Sign In */}
      <div className="flex items-center justify-center px-8 bg-canvas relative z-20">
        <LoginForm />
      </div>
    </div>
  );
}
