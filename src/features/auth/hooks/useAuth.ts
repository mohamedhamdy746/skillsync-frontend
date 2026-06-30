import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import * as authApi from "../api/auth.api";
import type { LoginPayload, RegisterPayload } from "../types";

/**
 * TanStack Query hooks for authentication.
 */

/** Fetch current user profile (runs when token exists). */
export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
  });
}

/** Login mutation — sets auth state on success. */
export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

/** Register mutation. */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "live"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "allMentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "allStudents"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

/** Update profile mutation — updates name and refreshes store. */
export function useUpdateProfile() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: { name: string }) => authApi.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
    },
  });
}
