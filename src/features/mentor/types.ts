import type { User } from "@/lib/types";

/** Extended mentor profile. */
export interface Mentor extends User {
  bio: string;
  title: string;
  stacks: Stack[];
  rating: number;
  hourlyRate: number;
  totalSessions: number;
  isApproved: boolean;
}

/** Tech stack / specialization. */
export interface Stack {
  id: number;
  name: string;
}

/** A single availability time slot. */
export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

/** Availability for a specific date. */
export interface Availability {
  date: string;
  slots: TimeSlot[];
}

/** Filters for the mentor discovery search. */
export interface MentorFilters {
  keyword?: string;
  stackId?: number;
  sortBy?: "rating" | "price" | "availability";
  page?: number;
}
