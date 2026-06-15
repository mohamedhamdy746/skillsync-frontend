/** Session status lifecycle. */
export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELED";

/** Audit log status. */
export type AuditStatus = "SUCCESS" | "FAILED";

/** Audit log entry for a session. */
export interface AuditLog {
  id: number;
  predictedTag: string | null;
  confidenceScore: number | null;
  status: AuditStatus;
  errorMessage?: string | null;
  latencyMs: number;
}

/** A booked mentorship review session. */
export interface Session {
  id: number;
  mentorId: number;
  mentorName: string;
  studentId: number;
  studentName: string;
  startTime: string;
  endTime: string;
  description: string;
  status: SessionStatus;
  evaluationNotes?: string | null;
  audit?: AuditLog | null;
}

/** Payload sent to POST /api/sessions */
export interface BookingPayload {
  mentorId: number;
  startTime: string;
  description: string;
}

/** Payload sent to PUT /api/sessions/:id */
export interface UpdateSessionPayload {
  status?: SessionStatus;
  startTime?: string;
  description?: string;
  evaluationNotes?: string;
}
