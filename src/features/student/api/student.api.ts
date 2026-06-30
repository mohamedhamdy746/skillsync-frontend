import { apiClient } from "@/lib/api-client";
import type { User } from "@/lib/types";

/**
 * Student-specific API endpoints.
 *
 * Most student operations (sessions, profile) use shared endpoints.
 * Add student-specific endpoints here as needed.
 */

/** Fetch the current authenticated student's profile via the canonical profile endpoint. */
export async function getStudentProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/profile");
  return data;
}
