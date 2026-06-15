import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as sessionApi from "../api/session.api";
import type { BookingPayload, UpdateSessionPayload } from "../types";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: sessionApi.getSessions,
  });
}

export function useBookSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingPayload) => sessionApi.bookSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
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
