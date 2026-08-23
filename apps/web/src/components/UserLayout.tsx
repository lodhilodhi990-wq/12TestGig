'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Settings, 
  LogOut, 
  Code, 
  Rocket, 
  FolderKanban, 
  Users, 
  Coins, 
  ArrowUpRight, 
  Plus, 
  Menu, 
  X,
  CreditCard,
  Flame,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'All-in-One Dashboard', href: '/tester/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: '🎮 EARN BY TESTING',
      items: [
        { name: 'Explore Apps to Test', href: '/tester/tests', icon: CheckSquare, badge: 'Earn Coins' },
      ],
    },
    {
      title: '📱 TEST MY APP (CREATOR)',
      items: [
        { name: 'My App Campaigns', href: '/customer/campaigns', icon: Rocket, badge: '20 Testers' },
        { name: 'Launch New App', href: '/customer/projects', icon: FolderKanban },
      ],
    },
    {
      title: '👥 REFER & EARN (PARTNER)',
      items: [
        { name: 'Affiliate & Commissions', href: '/earner/dashboard', icon: Users, badge: '10% Bonus' },
        { name: 'My Tester Network', href: '/earner/network', icon: Flame },
      ],
    },
    {
      title: '💰 WALLET & PAYMENTS',
      items: [
        { name: 'Coin Wallet & Withdraw', href: '/tester/wallet', icon: Wallet },
        { name: 'Buy Coins (Deposit)', href: '/customer/billing', icon: CreditCard },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Settings & Profile', href: '/tester/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-zinc-200 
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 bg-white">
          <Link href="/tester/dashboard" className="flex items-center gap-2.5 font-extrabold text-xl text-zinc-900 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span>12 Test Gig</span>
          </Link>
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-zinc-500 hover:text-zinc-800 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Quick Balance Bar */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl text-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase">Your Balance</p>
                <p className="text-xl font-bold">15,000 <span className="text-xs font-normal text-amber-400">Coins</span></p>
              </div>
            </div>
            <Link 
              href="/tester/wallet" 
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
            >
              Withdraw <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex justify-between text-[11px] text-zinc-400">
            <span>≈ $150.00 USD</span>
            <Link href="/customer/billing" className="text-blue-400 hover:text-blue-300 font-medium">+ Buy Coins</Link>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                {section.title}
              </p>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm shadow-blue-100' 
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-blue-200/60 text-blue-800' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Account Footer */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-zinc-900 truncate">All-in-One Account</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 font-bold text-base text-zinc-900">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              12 Test Gig
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/tester/wallet" className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <span>🪙 15k</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
