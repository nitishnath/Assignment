import { z } from 'zod';

// Zod schema for validation
export const TripPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  days: z.number().int().positive('Days must be a positive integer'),
  budget: z.number().positive('Budget must be a positive number')
});

// TypeScript interface
export interface TripPlan {
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt: Date;
}

// Request/Response types
export type CreateTripRequest = z.infer<typeof TripPlanSchema>;
export type UpdateTripRequest = Partial<CreateTripRequest>;

export interface TripResponse {
  _id: string;
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt: string;
}

export interface TripsListResponse {
  trips: TripResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}