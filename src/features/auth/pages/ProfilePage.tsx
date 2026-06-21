import { useAuthStore } from "@/stores/auth.store";
import MentorProfilePage from "./../../mentor/pages/MentorProfilePage";
import StudentProfilePage from "./../../student/pages/StudentProfilePage";

/**
 * ProfilePage — Contextual workspace to adjust user profiles.
 */
export default function ProfilePage() {
  const { user } = useAuthStore();

  if (user?.role === "MENTOR") {
    return <MentorProfilePage />;
  }

  if (user?.role === "STUDENT") {
    return <StudentProfilePage />;
  }

  return <MentorProfilePage />;
}
