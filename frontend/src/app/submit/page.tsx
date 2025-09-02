'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tripApi } from '@/lib/api';
import { CreateTripRequest } from '@/types/trip';
import TripForm from '@/components/TripForm';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

import Link from 'next/link';

export default function SubmitPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();


  const handleSubmit = async (data: CreateTripRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await tripApi.createTrip(data);
      setSuccess(true);
      

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Created Successfully!</h2>
                <p className="text-gray-600 mb-6">Your trip has been added to your collection.</p>
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
        <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Trip</h1>
              <p className="text-gray-600">Create a new trip plan with all the details</p>
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

              <TripForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitButtonText="Create Trip"
              />

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