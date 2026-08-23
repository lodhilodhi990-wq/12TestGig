import { Activity, DollarSign, Users, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: <DollarSign className="text-emerald-400" /> },
    { label: 'Active Campaigns', value: '143', change: '+12', icon: <Activity className="text-saas-accent" /> },
    { label: 'Total Testers', value: '12,094', change: '+892', icon: <Users className="text-purple-400" /> },
    { label: 'Play Store Ready', value: '89', change: '+2', icon: <CheckCircle2 className="text-blue-400" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-saas-muted mt-2">Welcome to the 12 Test Gig Super Admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-saas-card p-6 rounded-xl border border-slate-800 flex flex-col hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg">{m.icon}</div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {m.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-saas-text">{m.value}</h3>
            <p className="text-sm text-saas-muted mt-1 font-medium">{m.label}</p>
          </div>
        ))}
      </div>
      
      {/* Placeholder for charts */}
      <div className="h-96 w-full bg-saas-card border border-slate-800 rounded-xl flex items-center justify-center">
        <p className="text-saas-muted font-medium flex items-center gap-2">
          <Activity size={20} />
          System Health Monitoring Active
        </p>
      </div>
    </div>
  );
}
