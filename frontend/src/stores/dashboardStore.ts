import { create } from 'zustand';
import { tripApi } from '@/lib/api';
import { TripResponse } from '@/types/trip';

const TRIPS_PER_PAGE = 10;

// This interface defines the shape of the dashboard store
// It includes both the state and the actions that can be performed on it
interface DashboardState {
  // State
  trips: TripResponse[]; // Trips list
  searchTerm: string; // Current search term
  debouncedSearchTerm: string; // Debounced search term
  selectedDestination: string; // Selected destination
  destinations: string[]; // Destinations list
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  isLoading: boolean; // Loading state
  isSearching: boolean; // Searching state
  error: string | null; // Error state
  debounceTimeoutRef: NodeJS.Timeout | null; // Debounce timeout reference

  // Actions
  setTrips: (trips: TripResponse[]) => void; // Set trips list
  setSearchTerm: (term: string) => void; // Set search term
  setDebouncedSearchTerm: (term: string) => void; // Set debounced search term
  setSelectedDestination: (destination: string) => void; // Set selected destination
  setDestinations: (destinations: string[]) => void; // Set destinations list
  setCurrentPage: (page: number) => void; // Set current page number
  setTotalPages: (pages: number) => void; // Set total number of pages
  setIsLoading: (loading: boolean) => void; // Set loading state
  setIsSearching: (searching: boolean) => void; // Set searching state
  setError: (error: string | null) => void; // Set error state
  setDebounceTimeoutRef: (ref: NodeJS.Timeout | null) => void; // Set debounce timeout reference

  // Complex actions
  fetchTrips: () => Promise<void>; // Fetch trips
  handleSearchChange: (value: string) => void; // Handle search term change
  handlePageChange: (page: number) => void; // Handle page change
  handleDestinationChange: (destination: string) => void; // Handle destination change
  clearDebounceTimeout: () => void; // Clear debounce timeout
  initialize: () => Promise<void>; // Initialize store
}

// This useDashboardStore is a Zustand store that manages the state of the dashboard
export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  trips: [],
  searchTerm: '',
  debouncedSearchTerm: '',
  selectedDestination: '',
  destinations: [],
  currentPage: 1,
  totalPages: 0,
  isLoading: true,
  isSearching: false,
  error: null,
 debounceTimeoutRef: null,

  // Simple setters
  setTrips: (trips) => set({ trips }), // Set trips list
  setSearchTerm: (searchTerm) => set({ searchTerm }), // Set search term
  setDebouncedSearchTerm: (debouncedSearchTerm) => set({ debouncedSearchTerm }), // Set debounced search term
  setSelectedDestination: (selectedDestination) => set({ selectedDestination }), // Set selected destination
  setDestinations: (destinations) => set({ destinations }), // Set destinations list
  setCurrentPage: (currentPage) => set({ currentPage }), // Set current page number
  setTotalPages: (totalPages) => set({ totalPages }), // Set total number of pages
  setIsLoading: (isLoading) => set({ isLoading }), // Set loading state
  setIsSearching: (isSearching) => set({ isSearching }), // Set searching state
  setError: (error) => set({ error }), // Set error state
  setDebounceTimeoutRef: (debounceTimeoutRef) => set({ debounceTimeoutRef }), // Set debounce timeout reference

  // This function fetches trips and extracts destinations
  fetchTrips: async () => {
    const { currentPage, debouncedSearchTerm, selectedDestination } = get();
    
    try {
      set({ isLoading: true, error: null });
      
      const response = await tripApi.getTrips({
        page: currentPage,
        limit: TRIPS_PER_PAGE,
        search: debouncedSearchTerm || undefined,
        destination: selectedDestination || undefined
      });
      
      // Update destinations from the response if we don't have a destination filter
      // This eliminates the need for a separate fetchDestinations call
      let updatedDestinations = get().destinations;
      if (!selectedDestination && !debouncedSearchTerm) {
        // Only update destinations when showing all trips to get complete list
        const allDestinations = response.trips.map(trip => trip.destination);
        const uniqueDestinations = [...new Set([...updatedDestinations, ...allDestinations])].sort((a, b) => a.localeCompare(b));
        updatedDestinations = uniqueDestinations;
      }
      
      set({ 
        trips: response.trips, 
        totalPages: response.totalPages,
        destinations: updatedDestinations
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trips';
      
      set({ 
        error: errorMessage, 
        trips: [],
        totalPages: 0
      });
    } finally {
      set({ 
        isLoading: false, 
        isSearching: false 
      });
    }
  },

  handleSearchChange: (value: string) => {
    
    set({ searchTerm: value, isSearching: true });
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      set({ 
        debouncedSearchTerm: value, 
        currentPage: 1 
      });
      // Trigger fetch after debounce
      get().fetchTrips();
    }, 300);
    
    set({ debounceTimeoutRef: newTimeout });
  },

  handlePageChange: (page: number) => {
    set({ currentPage: page });
    // Trigger fetch with new page
    get().fetchTrips();
  },

  handleDestinationChange: (destination: string) => {
    set({ 
      selectedDestination: destination, 
      currentPage: 1 
    });
    // Trigger fetch with new filter
    get().fetchTrips();
  },

  clearDebounceTimeout: () => {
    const { debounceTimeoutRef } = get();
    if (debounceTimeoutRef) {
      clearTimeout(debounceTimeoutRef);
      set({ debounceTimeoutRef: null });
    }
  },

  initialize: async () => {
    const { fetchTrips } = get();
    // Single call that fetches trips and extracts destinations
    await fetchTrips();
  },
}));