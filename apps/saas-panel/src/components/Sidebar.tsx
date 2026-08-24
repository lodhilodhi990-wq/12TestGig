import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Zap, 
  Coins, 
  Rocket, 
  ArrowUpRight,
  LogOut,
  DollarSign,
  Smartphone,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const coreOperations = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/users', label: 'Users & Balances', icon: Users },
    { path: '/deposits', label: 'Deposits Queue', icon: Coins, badge: 'Live' },
    { path: '/withdrawals', label: 'Withdrawals Desk', icon: ArrowUpRight, badge: 'Payouts' },
    { path: '/campaigns', label: 'App Campaigns', icon: Rocket },
    { path: '/disputes', label: 'Anti-Scam Radar', icon: ShieldAlert },
  ];

  const gatewaySettings = [
    { path: '/pricing', label: 'Coin Pricing & Rates', icon: DollarSign },
    { path: '/deposit-methods', label: 'Deposit Accounts', icon: Smartphone },
    { path: '/withdrawal-settings', label: 'Withdrawal Settings', icon: CreditCard },
    { path: '/api-gateways', label: 'Auto-Verify APIs', icon: Zap },
    { path: '/security-rules', label: 'Security & Webhooks', icon: ShieldCheck },
  ];

  const marketingCms = [
    { path: '/blog-manager', label: 'SEO Blog & Guides', icon: BookOpen, badge: 'CMS' },
    { path: '/adsense-manager', label: 'Google AdSense Ads', icon: Sparkles, badge: 'Monetize' },
    { path: '/alerts-manager', label: 'WhatsApp & Email Alerts', icon: MessageSquare, badge: 'Alerts' },
  ];

  return (
    <aside className="w-56 bg-[#0b1120] border-r border-slate-800/80 flex flex-col h-screen select-none font-sans shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight block">12 Test Gig</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block -mt-0.5">SaaS Admin Hub</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Section 1: Main Platform Operations */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">Platform Operations</p>
          <div className="space-y-0.5">
            {coreOperations.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Section 2: Payments, Rates & Gateway Settings */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">Payments & Pricing</p>
          <div className="space-y-0.5">
            {gatewaySettings.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                    isActive 
                      ? 'bg-emerald-600/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Section 3: Marketing & CMS */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">CMS & Marketing</p>
          <div className="space-y-0.5">
            {marketingCms.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                    isActive 
                      ? 'bg-indigo-600/15 text-indigo-400 font-bold border border-indigo-500/30 shadow-[0_0_8px_rgba(99,102,241,0.15)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080d1a]">
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
              {currentUser?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-white block truncate">{currentUser?.email?.split('@')[0] || 'SuperAdmin'}</span>
              <span className="text-[9px] text-emerald-400 block font-mono">Master Mode</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
