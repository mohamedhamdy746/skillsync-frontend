import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as sessionApi from "../api/session.api";
import type { BookingPayload, UpdateSessionPayload } from "../types";

/**
 * TanStack Query hooks for session management.
 */

/** Fetch all sessions for the current user. */
export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: sessionApi.getSessions,
  });
}

/** Book a new session — invalidates session list on success. */
export function useBookSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingPayload) => sessionApi.bookSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Update session status / add evaluation notes. */
export function useUpdateSession(sessionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) =>
      sessionApi.updateSessionStatus(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Fetch audit log for a specific session. */
export function useSessionAudit(sessionId: number) {
  return useQuery({
    queryKey: ["sessions", sessionId, "audit"],
    queryFn: () => sessionApi.getSessionAudit(sessionId),
    enabled: !!sessionId,
  });
}
