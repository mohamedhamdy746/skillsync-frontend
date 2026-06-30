import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import * as sessionApi from "../api/session.api";
import type { BookingPayload, UpdateSessionPayload } from "../types";

export function useSessions() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ["sessions", user?.role, user?.id],
    queryFn: sessionApi.getSessions,
    enabled: isAuthenticated && !!user,
  });
}

export function useBookSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingPayload) => sessionApi.bookSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useUpdateSession(sessionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) =>
      sessionApi.updateSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useUpdateSessionById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: number;
      payload: UpdateSessionPayload;
    }) => sessionApi.updateSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useSessionAudit(sessionId: number) {
  return useQuery({
    queryKey: ["sessions", sessionId, "audit"],
    queryFn: () => sessionApi.getSessionAudit(sessionId),
    enabled: !!sessionId,
  });
}
