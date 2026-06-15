import { apiClient } from "@/lib/api-client";
import type {
  AuditLog,
  BookingPayload,
  Session,
  UpdateSessionPayload,
} from "../types";

export async function bookSession(payload: BookingPayload): Promise<Session> {
  const { data } = await apiClient.post<Session>("/sessions", payload);
  return data;
}

export async function getSessions(): Promise<Session[]> {
  const { data } = await apiClient.get<Session[]>("/sessions");
  return data;
}

export async function updateSession(
  sessionId: number,
  payload: UpdateSessionPayload,
): Promise<Session> {
  const { data } = await apiClient.put<Session>(`/sessions/${sessionId}`, payload);
  return data;
}

export async function getSessionAudit(sessionId: number): Promise<AuditLog> {
  const { data } = await apiClient.get<AuditLog>(`/sessions/${sessionId}/audit-log`);
  return data;
}
