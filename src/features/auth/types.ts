import type { RoleType } from "@/lib/constants";
import type { User } from "@/lib/types";

/** Re-export User for convenience within the auth feature. */
export type { User };

/** Payload sent to POST /api/auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Payload sent to POST /api/auth/register */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

/** Response from login/register endpoints */
export interface AuthResponse {
  user: User;
  token: string;
}
