import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import type { RoleType } from "@/lib/constants";

/**
 * Route guard component — wraps protected route groups.
 *
 * @prop allowedRoles — Optional whitelist. If omitted, any authenticated user passes.
 *
 * Usage in router.tsx:
 *   <Route element={<ProtectedRoute allowedRoles={["MENTOR"]} />}>
 *     <Route path="/mentor/dashboard" element={<MentorDashboard />} />
 *   </Route>
 */

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not logged in → redirect to login (preserve intended destination)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → redirect to home
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
