import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/admin.api";
import type { CreateStackPayload, UserStatusPayload } from "../types";

/**
 * TanStack Query hooks for admin operations.
 */

/** Fetch all platform users. */
export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
  });
}

/** Approve or block a user account. */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: UserStatusPayload;
    }) => adminApi.updateUserStatus(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

/** Create a new tech stack category. */
export function useCreateStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStackPayload) => adminApi.createStack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}

/** Delete a tech stack category. */
export function useDeleteStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stackId: number) => adminApi.deleteStack(stackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}
