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
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'admin' || user.role === 'super_admin') router.push('/admin/dashboard');
        else if (user.role === 'customer') router.push('/customer/dashboard');
        else if (user.role === 'tester') router.push('/tester/dashboard');
        else if (user.role === 'earner') router.push('/earner/dashboard');
        else router.push('/login');
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="flex h-screen items-center justify-center">Access Denied</div>;
  }

  return <>{children}</>;
}
