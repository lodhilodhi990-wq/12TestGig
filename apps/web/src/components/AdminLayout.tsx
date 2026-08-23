'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white border-r border-slate-700">
        <div className="p-6 font-bold text-xl border-b border-slate-700">12 Test Gig Admin</div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-slate-800 rounded">Dashboard</Link>
          <Link href="/admin/customers" className="block px-4 py-2 hover:bg-slate-800 rounded">Customers</Link>
          <Link href="/admin/campaigns" className="block px-4 py-2 hover:bg-slate-800 rounded">Reviews</Link>
          <Link href="/admin/projects" className="block px-4 py-2 hover:bg-slate-800 rounded">Projects</Link>
          <Link href="/admin/settings" className="block px-4 py-2 hover:bg-slate-800 rounded">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin Workspace</h2>
          <div className="flex items-center space-x-4">
            <span>{user?.fullName}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
