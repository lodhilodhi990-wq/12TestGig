import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Settings, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Overview', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Organizations', to: '/organizations', icon: <Building size={20} /> },
    { name: 'Users', to: '/users', icon: <Users size={20} /> },
    { name: 'Risk / Disputes', to: '/risk', icon: <ShieldAlert size={20} /> },
    { name: 'Settings', to: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-saas-card border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-saas-accent tracking-tight">12 Test Gig</h1>
        <p className="text-xs text-saas-muted mt-1 uppercase tracking-wider">Super Admin</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-saas-accent/10 text-saas-accent' 
                  : 'text-saas-muted hover:bg-slate-800 hover:text-saas-text'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <button className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-saas-text rounded-lg transition text-sm font-medium">
          Sign Out
        </button>
      </div>
    </div>
  );
}
