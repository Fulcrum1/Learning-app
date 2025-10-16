'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status
  useEffect(() => {
    // If no user is found and we're not already on the login page, redirect to login
    if (!user && !isLoading) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Set loading to false after initial check
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return null; // The useEffect will handle the redirect
  }
  
  // Déterminer la page active en fonction du pathname
  const getActivePage = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/library')) return 'library';
    if (pathname.startsWith('/users')) return 'users';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/documents')) return 'documents';
    if (pathname.startsWith('/calendar')) return 'calendar';
    if (pathname.startsWith('/messages')) return 'messages';
    if (pathname.startsWith('/notifications')) return 'notifications';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activePage={getActivePage()} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
