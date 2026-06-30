import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/types";
import type { Stack } from "@/features/mentor/types";
import type { AdminUser, CreateStackPayload, UserStatusPayload } from "../types";

export interface AdminRegistrationMentorResponse {
  id: number;
  name: string;
  email: string;
  stackName: string;
  appliedDate: string;
  isVerified: boolean;
}

export interface AdminLiveMentorResponse {
  id: number;
  displayName: string;
  email: string;
  stackName: string;
  available: boolean;
  rating: number | null;
}

export interface AdminStatsResponse {
  totalSessions: number;
  activeMentors: number;
  pendingLiveVerifications: number;
  pendingRegistrations: number;
  averagePlatformRating: number | null;
}

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

export async function updateStack(
  stackId: number,
  payload: { name: string; description?: string },
): Promise<Stack> {
  const { data } = await apiClient.put<Stack>(`/stacks/${stackId}`, payload);
  return data;
}

export async function deleteStack(stackId: number): Promise<void> {
  await apiClient.delete(`/stacks/${stackId}`);
}

export async function getStackById(stackId: number): Promise<Stack> {
  const { data } = await apiClient.get<Stack>(`/stacks/${stackId}`);
  return data;
}

export async function getPendingRegistrations(
  page: number,
  size: number,
): Promise<PaginatedResponse<AdminRegistrationMentorResponse>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminRegistrationMentorResponse>>(
    "/admin/mentors/pending/registrations",
    { params: { page, size } },
  );
  return data;
}

export async function updateRegistrationVerification(
  id: number,
  isVerified: boolean,
): Promise<void> {
  await apiClient.put(`/admin/mentors/registrations/${id}/verification`, { isVerified });
}

export async function getPendingLiveVerifications(
  page: number,
  size: number,
): Promise<PaginatedResponse<AdminLiveMentorResponse>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminLiveMentorResponse>>(
    "/admin/mentors/pending/live",
    { params: { page, size } },
  );
  return data;
}

export async function updateLiveVerification(
  id: number,
  isVerified: boolean,
): Promise<void> {
  await apiClient.put(`/admin/mentors/live/${id}/verification`, { isVerified });
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const { data } = await apiClient.get<AdminStatsResponse>("/admin/stats");
  return data;
}

export interface AdminMentorListResponse {
  id: number;
  userId: number;
  displayName: string;
  email: string;
  stackName: string;
  title: string;
  bio: string;
  available: boolean;
  isBlocked: boolean;
  rating: number | null;
  hourlyRate: number;
  totalSessions: number;
}

export interface AdminMentorDetailResponse extends AdminMentorListResponse {
  stackId: number | null;
  sessions: AdminSessionSummaryResponse[];
}

export interface AdminStudentListResponse {
  id: number;
  userId: number;
  displayName: string;
  email: string;
  isBlocked: boolean;
  totalSessions: number;
}

export interface AdminStudentDetailResponse {
  id: number;
  displayName: string;
  email: string;
  totalSessions: number;
  sessions: AdminSessionSummaryResponse[];
}

export interface AdminSessionSummaryResponse {
  id: number;
  mentorName: string;
  studentName: string;
  studentEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  description: string;
}

export async function getAllMentors(
  page: number,
  size: number,
): Promise<PaginatedResponse<AdminMentorListResponse>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminMentorListResponse>>(
    "/admin/mentors",
    { params: { page, size } },
  );
  return data;
}

export async function getMentorDetail(id: number): Promise<AdminMentorDetailResponse> {
  const { data } = await apiClient.get<AdminMentorDetailResponse>(`/admin/mentors/${id}`);
  return data;
}

export async function getAllStudents(
  page: number,
  size: number,
): Promise<PaginatedResponse<AdminStudentListResponse>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminStudentListResponse>>(
    "/admin/students",
    { params: { page, size } },
  );
  return data;
}

export async function getStudentDetail(id: number): Promise<AdminStudentDetailResponse> {
  const { data } = await apiClient.get<AdminStudentDetailResponse>(`/admin/students/${id}`);
  return data;
}
