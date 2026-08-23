import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Settings, ShieldAlert, Zap } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/organizations', label: 'Organizations', icon: Building },
    { path: '/disputes', label: 'Disputes & Risk', icon: ShieldAlert },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-saas-dark border-r border-saas-border flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-saas-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-saas-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Admin SaaS</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-saas-accent/10 text-saas-accent font-medium shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]' 
                  : 'text-saas-text-muted hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-saas-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-saas-accent to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-saas-text-muted truncate">admin@12testgig.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
