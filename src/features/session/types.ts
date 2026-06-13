/** Session status lifecycle. */
export type SessionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

/** A booked code review session. */
export interface Session {
  id: number;
  studentId: number;
  mentorId: number;
  mentorName: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  evaluationNotes?: string;
  createdAt: string;
}

/** Payload sent to POST /api/sessions/book */
export interface BookingPayload {
  mentorId: number;
  slotId: number;
  date: string;
}

/** Payload sent to PUT /api/sessions/:id/status */
export interface UpdateSessionPayload {
  status: SessionStatus;
  evaluationNotes?: string;
}

/** Audit log entry for a session. */
export interface AuditLog {
  id: number;
  sessionId: number;
  action: string;
  performedBy: number;
  timestamp: string;
  details?: string;
}
