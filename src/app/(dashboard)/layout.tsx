'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Layouts/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Déterminer la page active en fonction du pathname
  const getActivePage = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/library')) return 'library';
    if (pathname.startsWith('/users')) return 'users';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/lists')) return 'lists';
    // if (pathname.startsWith('/calendar')) return 'calendar';
    // if (pathname.startsWith('/messages')) return 'messages';
    // if (pathname.startsWith('/notifications')) return 'notifications';
    // if (pathname.startsWith('/settings')) return 'settings';
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
