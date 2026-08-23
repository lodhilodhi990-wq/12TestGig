'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, FolderKanban, Rocket, CreditCard, Settings, LogOut, Code } from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Overview', href: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', href: '/customer/projects', icon: FolderKanban },
    { name: 'Campaigns', href: '/customer/campaigns', icon: Rocket },
    { name: 'Billing', href: '/customer/billing', icon: CreditCard },
    { name: 'Settings', href: '/customer/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-zinc-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <Link href="/customer/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            12 Test Gig
          </Link>
        </div>

        <div className="px-4 py-4 border-b border-zinc-100">
          <WorkspaceSwitcher />
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-700' : 'text-zinc-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 truncate">Developer Account</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 md:hidden justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            12 Test Gig
          </div>
          <button onClick={logout} className="text-zinc-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
