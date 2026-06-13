import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Role } from "@/lib/constants";
import ProtectedRoute from "./ProtectedRoute";
import { LoadingFallback } from "@/components/feedback";

/* ─── Lazy-loaded layout ───────────────────────────────────────────── */
const RootLayout = lazy(() => import("@/components/layout/RootLayout"));

/* ─── Lazy-loaded pages ────────────────────────────────────────────── */
const MentorDiscoveryPage = lazy(
  () => import("@/features/mentor/pages/MentorDiscoveryPage"),
);
const MentorProfilePage = lazy(
  () => import("@/features/mentor/pages/MentorProfilePage"),
);
const MentorDashboardPage = lazy(
  () => import("@/features/mentor/pages/MentorDashboardPage"),
);
const StudentDashboardPage = lazy(
  () => import("@/features/student/pages/StudentDashboardPage"),
);
const AdminDashboardPage = lazy(
  () => import("@/features/admin/pages/AdminDashboardPage"),
);
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/**
 * Application router — all routes with lazy loading + role guards.
 *
 * Route structure:
 *   /                   → Mentor Discovery (public)
 *   /login              → Login
 *   /register           → Register
 *   /mentors/:id        → Mentor Profile & Booking
 *   /dashboard          → Student Dashboard (STUDENT only)
 *   /mentor/dashboard   → Mentor Dashboard (MENTOR only)
 *   /admin              → Admin Dashboard (ADMIN only)
 *   /profile            → Profile Customization (any auth)
 *   *                   → 404 Not Found
 */
export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RootLayout />
      </Suspense>
    ),
    children: [
      /* ─── Public Routes ─────────────────────────────────── */
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MentorDiscoveryPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/mentors/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MentorProfilePage />
          </Suspense>
        ),
      },

      /* ─── Authenticated Routes (any role) ────────────────── */
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },

      /* ─── Student-Only Routes ────────────────────────────── */
      {
        element: <ProtectedRoute allowedRoles={[Role.STUDENT]} />,
        children: [
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <StudentDashboardPage />
              </Suspense>
            ),
          },
        ],
      },

      /* ─── Mentor-Only Routes ─────────────────────────────── */
      {
        element: <ProtectedRoute allowedRoles={[Role.MENTOR]} />,
        children: [
          {
            path: "/mentor/dashboard",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MentorDashboardPage />
              </Suspense>
            ),
          },
        ],
      },

      /* ─── Admin-Only Routes ──────────────────────────────── */
      {
        element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
        children: [
          {
            path: "/admin",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboardPage />
              </Suspense>
            ),
          },
        ],
      },

      /* ─── 404 Catch-All ──────────────────────────────────── */
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
