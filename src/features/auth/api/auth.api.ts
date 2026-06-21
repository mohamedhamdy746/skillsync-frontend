import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

/**
 * Auth API endpoints.
 *
 * POST /api/auth/login    → Authenticate user, receive JWT
 * POST /api/auth/register → Create new account
 * GET  /api/auth/profile  → Fetch current user profile
 */

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/profile");
  return data;
}

export async function updateProfile(payload: { name: string }): Promise<User> {
  const { data } = await apiClient.put<User>("/auth/profile", payload);
  return data;
}
