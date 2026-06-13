import { apiClient } from "@/lib/api-client";
import type {
  AuditLog,
  BookingPayload,
  Session,
  UpdateSessionPayload,
} from "../types";

/**
 * Session API endpoints.
 *
 * POST /api/sessions/book          → Book a new session
 * GET  /api/sessions               → List user's sessions
 * PUT  /api/sessions/:id/status    → Update session status / add evaluation
 * GET  /api/sessions/:id/audit     → Fetch session audit log
 */

export async function bookSession(payload: BookingPayload): Promise<Session> {
  const { data } = await apiClient.post<Session>("/sessions/book", payload);
  return data;
}

export async function getSessions(): Promise<Session[]> {
  const { data } = await apiClient.get<Session[]>("/sessions");
  return data;
}

export async function updateSessionStatus(
  sessionId: number,
  payload: UpdateSessionPayload,
): Promise<Session> {
  const { data } = await apiClient.put<Session>(
    `/sessions/${sessionId}/status`,
    payload,
  );
  return data;
}

export async function getSessionAudit(sessionId: number): Promise<AuditLog[]> {
  const { data } = await apiClient.get<AuditLog[]>(
    `/sessions/${sessionId}/audit`,
  );
  return data;
}
