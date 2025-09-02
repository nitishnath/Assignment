'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { TripResponse } from '@/types/trip';

// This interface is used to define the props for the Dashboard component
interface DashboardProps {
  showHeader?: boolean;
}

// This component is used to display the dashboard for the user
export default function Dashboard({ showHeader = true }: DashboardProps) {
  const {
    trips,
    searchTerm,
    selectedDestination,
    destinations,
    currentPage,
    totalPages,
    isLoading,
    isSearching,
    error,
    fetchTrips,
    handleSearchChange,
    handlePageChange,
    handleDestinationChange,
    clearDebounceTimeout,
    initialize
  } = useDashboardStore();
  
  // This ref is used to maintain focus on search input during re-renders
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize data on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // This useEffect is used to maintain focus on search input during re-renders
  useEffect(() => {
    if (searchInputRef.current && searchTerm && document.activeElement !== searchInputRef.current) {
      const cursorPosition = searchInputRef.current.selectionStart;
      searchInputRef.current.focus();
      if (cursorPosition !== null) {
        searchInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }, [isSearching, searchTerm]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearDebounceTimeout();
    };
  }, [clearDebounceTimeout]);

  // This function is used to handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearchChange(value);

    setTimeout(() => {
      if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  // Render header component
  const renderHeader = () => {
    if (!showHeader) return null;
    
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Plan and manage your next trip</p>
            </div>
            
            {/* Mobile Controls - Stacked */}
            <div className="space-y-3">
              {/* Search Field - Full width on mobile */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter and Add Button Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Destination Filter */}
                <div className="flex-1">
                  <select
                    value={selectedDestination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">All Destinations</option>
                    {destinations.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Add New Travel Button */}
                <Link
                  href="/submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center cursor-pointer whitespace-nowrap"
                >
                  <span className="sm:hidden">+ Add Trip</span>
                  <span className="hidden sm:inline">+ Add New Travel</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Plan and manage your next trip</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Destination Filter */}
              <div className="relative">
                <select
                  value={selectedDestination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All Destinations</option>
                  {destinations.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </div>
              {/* Search Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Link
                href="/submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center cursor-pointer"
              >
               + Add New Travel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading || isSearching) {
    return (
      <>
        {renderHeader()}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">{isSearching ? 'Searching trips...' : 'Loading your trips...'}</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        {renderHeader()}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load trips</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTrips}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {renderHeader()}

      {/* Trip Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500">{searchTerm ? 'Try adjusting your search terms.' : 'No trips available. Create your first trip!'}</p>
            {!searchTerm && (
              <Link
                href="/submit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Trip
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
              {trips.map((trip: TripResponse) => (
                <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{trip.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500 mb-4 gap-1 sm:gap-0">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{trip.destination}</span>
                      </span>
                      <span className="flex items-center">
                        {trip.days} days
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
                      <span className="text-xl sm:text-2xl font-bold text-green-600">₹{trip.budget.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/edit/${trip._id}`} 
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                      >
                        Edit Trip
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 gap-4 sm:gap-0">
                {/* Mobile: Show current page info */}
                <div className="block sm:hidden text-sm text-gray-600 mb-2">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">‹</span>
                  </button>
                  
                  {/* Desktop: Show all page numbers, Mobile: Show limited pages */}
                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  {/* Mobile: Show limited page numbers */}
                  <div className="flex sm:hidden items-center space-x-1">
                    {(() => {
                      const pages = [];
                      const startPage = Math.max(1, currentPage - 1);
                      const endPage = Math.min(totalPages, currentPage + 1);
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-2 py-2 rounded-md text-sm ${
                              currentPage === i
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">›</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}