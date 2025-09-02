import { CreateTripRequest, UpdateTripRequest, TripResponse, TripsListResponse, TripFilters } from '@/types/trip';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// This class is used to handle API errors
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// This function is used to handle API requests
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const tripApi = {
  // Create a new trip
  createTrip: async (trip: CreateTripRequest): Promise<TripResponse> => {
    return fetchApi<TripResponse>('/api/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  },

  // Get all trips with filters (search, destination, pagination, budget)
  getTrips: async (filters: TripFilters = {}): Promise<TripsListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.minBudget !== undefined) params.append('minBudget', filters.minBudget.toString());
    if (filters.maxBudget !== undefined) params.append('maxBudget', filters.maxBudget.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/trips?${queryString}` : '/api/trips';
    
    return fetchApi<TripsListResponse>(endpoint);
  },

  // Get a single trip by ID
  getTripById: async (id: string): Promise<TripResponse> => {
    return fetchApi<TripResponse>(`/api/trips/${id}`);
  },

  // Update a trip
  updateTrip: async (id: string, trip: UpdateTripRequest): Promise<TripResponse> => {
    return fetchApi<TripResponse>(`/api/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trip),
    });
  },
};

export { ApiError };