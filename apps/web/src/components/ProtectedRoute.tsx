'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@12-test-gig/types';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Role[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles) {
        const isStandardUser = ['customer', 'tester', 'earner', 'user'].includes(user.role);
        const allowsStandardUser = allowedRoles.some(r => ['customer', 'tester', 'earner', 'user'].includes(r));
        
        const isAuthorized = allowedRoles.includes(user.role) || (isStandardUser && allowsStandardUser);

        if (!isAuthorized) {
          if (user.role === 'admin' || user.role === 'super_admin') router.push('/admin/dashboard');
          else router.push('/tester/dashboard'); // Default landing for standard users
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (allowedRoles) {
    const isStandardUser = ['customer', 'tester', 'earner', 'user'].includes(user.role);
    const allowsStandardUser = allowedRoles.some(r => ['customer', 'tester', 'earner', 'user'].includes(r));
    const isAuthorized = allowedRoles.includes(user.role) || (isStandardUser && allowsStandardUser);
    
    if (!isAuthorized) {
      return <div className="flex h-screen items-center justify-center">Access Denied</div>;
    }
  }

  return <>{children}</>;
}
