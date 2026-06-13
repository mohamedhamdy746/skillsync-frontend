import { apiClient } from "@/lib/api-client";
import type {
  AdminUser,
  CreateStackPayload,
  UserStatusPayload,
} from "../types";
import type { Stack } from "@/features/mentor/types";

/**
 * Admin API endpoints.
 *
 * GET    /api/admin/users            → All platform users
 * PUT    /api/admin/users/:id/status → Approve / block user
 * POST   /api/stacks                 → Create tech stack
 * DELETE /api/stacks/:id             → Remove tech stack
 */

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<AdminUser[]>("/admin/users");
  return data;
}

export async function updateUserStatus(
  userId: number,
  payload: UserStatusPayload,
): Promise<AdminUser> {
  const { data } = await apiClient.put<AdminUser>(
    `/admin/users/${userId}/status`,
    payload,
  );
  return data;
}

export async function createStack(
  payload: CreateStackPayload,
): Promise<Stack> {
  const { data } = await apiClient.post<Stack>("/stacks", payload);
  return data;
}

export async function deleteStack(stackId: number): Promise<void> {
  await apiClient.delete(`/stacks/${stackId}`);
}
