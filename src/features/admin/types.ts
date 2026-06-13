import type { User } from "@/lib/types";
import type { Stack } from "@/features/mentor/types";

/** Re-export for admin views */
export type { Stack };

/** User record as seen in the admin panel. */
export interface AdminUser extends User {
  isApproved: boolean;
  isBlocked: boolean;
}

/** Payload for approving / blocking a user. */
export interface UserStatusPayload {
  status: "APPROVED" | "BLOCKED";
}

/** Payload for creating a new tech stack. */
export interface CreateStackPayload {
  name: string;
}
