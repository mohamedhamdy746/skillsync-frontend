import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
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
