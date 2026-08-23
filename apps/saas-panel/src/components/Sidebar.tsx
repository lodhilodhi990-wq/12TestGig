import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Settings, 
  ShieldAlert, 
  Zap, 
  Coins, 
  Rocket, 
  LogOut
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

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/users', label: 'Users & Risk', icon: Users, badge: 'Scam Alerts' },
    { path: '/deposits', label: 'Coin Deposits', icon: Coins, badge: 'Pending' },
    { path: '/campaigns', label: 'App Campaigns', icon: Rocket },
    { path: '/disputes', label: 'Disputes & Anti-Scam', icon: ShieldAlert },
    { path: '/organizations', label: 'Organizations', icon: Building },
    { path: '/settings', label: 'Settings & Rates', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#0b1120] border-r border-slate-800/80 flex flex-col h-screen select-none font-sans shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block">12 Test Gig</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block -mt-0.5">SaaS Admin</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 pb-1 text-[10px] font-bold text-slate-500 tracking-wider uppercase">Management</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Sign Out Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
            {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">
              {currentUser?.displayName || 'Super Admin'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser?.email || 'admin@12testgig.com'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
