'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TripForm from '@/components/TripForm';
import { tripApi } from '@/lib/api';
import { CreateTripRequest, TripResponse } from '@/types/trip';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function EditTripPage() {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;


  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const tripData = await tripApi.getTripById(tripId);
        setTrip(tripData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch trip');
      } finally {
        setIsFetching(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleSubmit = async (data: CreateTripRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await tripApi.updateTrip(tripId, data);
      setSuccess(true);
      

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update trip');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading trip details...</p>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error && !trip) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (success) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Updated Successfully!</h2>
                <p className="text-gray-600 mb-6">Your trip has been updated with the new information.</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Trip</h1>
              <p className="text-gray-600">Update your trip plan details</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {trip && (
                <TripForm
                  initialData={trip}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  submitButtonText="Update Trip"
                />
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}