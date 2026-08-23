'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function TesterDashboard() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['tester']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">12 Test Gig Tester</h1>
        <p className="mt-4">Tester workspace is ready</p>
        <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
      </div>
    </ProtectedRoute>
  );
}
