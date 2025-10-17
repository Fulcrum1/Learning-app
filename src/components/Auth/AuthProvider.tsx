'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérification de l'authentification
  useEffect(() => {
    // Liste des routes publiques qui ne nécessitent pas d'authentification
    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    // Si l'utilisateur n'est pas connecté et n'est pas sur une route publique, rediriger vers /login
    if (!user && !isLoading && !isPublicPath) {
      router.push('/login');
    }
    
    // Si l'utilisateur est connecté et sur une page de connexion, rediriger vers le tableau de bord
    if (user && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  // Mettre à jour l'état de chargement après la vérification initiale
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // Afficher un indicateur de chargement pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
