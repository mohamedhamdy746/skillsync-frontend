import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as adminApi from "../api/admin.api";
import type { CreateStackPayload, UpdateStackPayload, UserStatusPayload } from "../types";
import { useStacks } from "@/features/mentor/hooks/useStacks";

const ITEMS_PER_PAGE = 20;

export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
  });
}

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
      queryClient.invalidateQueries({ queryKey: ["admin", "allMentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "allStudents"] });
    },
  });
}

export function useCreateStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStackPayload) => adminApi.createStack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}

export function useDeleteStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stackId: number) => adminApi.deleteStack(stackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}

export function useUpdateStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stackId, payload }: { stackId: number; payload: UpdateStackPayload }) =>
      adminApi.updateStack(stackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      toast.success("Stack updated");
    },
    onError: () => {
      toast.error("Failed to update stack");
    },
  });
}

export function useStackList() {
  return useStacks();
}

export function usePendingRegistrations(page: number) {
  return useQuery({
    queryKey: ["admin", "registrations", { page, size: ITEMS_PER_PAGE }],
    queryFn: () => adminApi.getPendingRegistrations(page, ITEMS_PER_PAGE),
    placeholderData: (previousData) => previousData,
  });
}

export function usePendingLiveVerifications(page: number) {
  return useQuery({
    queryKey: ["admin", "live", { page, size: ITEMS_PER_PAGE }],
    queryFn: () => adminApi.getPendingLiveVerifications(page, ITEMS_PER_PAGE),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getAdminStats,
    refetchInterval: 30_000,
  });
}

export function useUpdateRegistrationVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isVerified,
    }: {
      id: number;
      isVerified: boolean;
    }) => adminApi.updateRegistrationVerification(id, isVerified),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "registrations"] });
      const snapshot = queryClient.getQueriesData<
        adminApi.AdminRegistrationMentorResponse[]
      >({ queryKey: ["admin", "registrations"] });

      queryClient.setQueriesData(
        { queryKey: ["admin", "registrations"] },
        (old: unknown) => {
          if (!old || typeof old !== "object" || !("items" in old)) return old;
          const data = old as { items: adminApi.AdminRegistrationMentorResponse[]; totalElements: number };
          return {
            ...data,
            items: data.items.filter((item) => item.id !== id),
            totalElements: data.totalElements - 1,
          };
        },
      );

      return { snapshot };
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        for (const [key, data] of context.snapshot) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("Failed to update registration");
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.isVerified
          ? "Mentor application approved"
          : "Mentor application rejected and account blocked",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "allMentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentorDetail"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useUpdateLiveVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isVerified,
    }: {
      id: number;
      isVerified: boolean;
    }) => adminApi.updateLiveVerification(id, isVerified),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "live"] });
      const snapshot = queryClient.getQueriesData<
        adminApi.AdminLiveMentorResponse[]
      >({ queryKey: ["admin", "live"] });

      queryClient.setQueriesData(
        { queryKey: ["admin", "live"] },
        (old: unknown) => {
          if (!old || typeof old !== "object" || !("items" in old)) return old;
          const data = old as { items: adminApi.AdminLiveMentorResponse[]; totalElements: number };
          return {
            ...data,
            items: data.items.filter((item) => item.id !== id),
            totalElements: data.totalElements - 1,
          };
        },
      );

      return { snapshot };
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        for (const [key, data] of context.snapshot) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("Failed to update live verification");
    },
    onSuccess: () => {
      toast.success("Live verification updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "live"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "allMentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentorDetail"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useAllMentors(page: number) {
  return useQuery({
    queryKey: ["admin", "allMentors", { page, size: ITEMS_PER_PAGE }],
    queryFn: () => adminApi.getAllMentors(page, ITEMS_PER_PAGE),
    placeholderData: (previousData) => previousData,
  });
}

export function useMentorDetail(id: number) {
  return useQuery({
    queryKey: ["admin", "mentorDetail", id],
    queryFn: () => adminApi.getMentorDetail(id),
    enabled: !!id,
  });
}

export function useAllStudents(page: number) {
  return useQuery({
    queryKey: ["admin", "allStudents", { page, size: ITEMS_PER_PAGE }],
    queryFn: () => adminApi.getAllStudents(page, ITEMS_PER_PAGE),
    placeholderData: (previousData) => previousData,
  });
}

export function useStudentDetail(id: number) {
  return useQuery({
    queryKey: ["admin", "studentDetail", id],
    queryFn: () => adminApi.getStudentDetail(id),
    enabled: !!id,
  });
}
