//This interface is used to define the props for TripPlan component
export interface TripPlan {
  _id?: string;
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt?: string;
}

//This interface is used to define the props for CreateTripRequest component
export interface CreateTripRequest {
  title: string;
  destination: string;
  days: number;
  budget: number;
}

//This interface is used to define the props for UpdateTripRequest component
export type UpdateTripRequest = Partial<CreateTripRequest>;

//This interface is used to define the props for TripResponse component
export interface TripResponse {
  _id: string;
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt: string;
}

//This interface is used to define the props for TripsListResponse component
export interface TripsListResponse {
  trips: TripResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

//This interface is used to define the props for TripFilters component
export interface TripFilters {
  destination?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  page?: number;
  limit?: number;
}