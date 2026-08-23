'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-6 font-bold text-xl border-b">12 Test Gig</div>
        <nav className="p-4 space-y-2">
          <Link href="/customer/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded">Dashboard</Link>
          <Link href="/customer/projects" className="block px-4 py-2 hover:bg-gray-100 rounded">Projects</Link>
          <Link href="/customer/apps" className="block px-4 py-2 hover:bg-gray-100 rounded">Apps</Link>
          <Link href="/customer/campaigns" className="block px-4 py-2 hover:bg-gray-100 rounded">Campaigns</Link>
          <Link href="/customer/testers" className="block px-4 py-2 text-gray-400 cursor-not-allowed">Testers</Link>
          <Link href="/customer/settings" className="block px-4 py-2 hover:bg-gray-100 rounded">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Workspace</h2>
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
