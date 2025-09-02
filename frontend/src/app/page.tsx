'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // This useEffect is used to redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : user ? 'Redirecting to dashboard...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    </Layout>
  );
}
