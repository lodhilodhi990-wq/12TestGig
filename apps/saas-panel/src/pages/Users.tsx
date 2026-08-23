import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Users() {
  const users = [
    { id: 'usr_1', name: 'John Doe', email: 'john@example.com', role: 'tester', earnings: '4,500 🪙', activeTests: 3, trustScore: 98, status: 'active' },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', spent: '12,000 🪙', campaigns: 2, trustScore: 100, status: 'active' },
    { id: 'usr_3', name: 'ScammerX', email: 'bot22@tempmail.com', role: 'tester', earnings: '15,000 🪙', activeTests: 25, trustScore: 12, status: 'flagged' },
    { id: 'usr_4', name: 'Alice Jones', email: 'alice@example.com', role: 'tester', earnings: '0 🪙', activeTests: 0, trustScore: 85, status: 'suspended' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Users & Risk Management</h1>
          <p className="text-saas-muted mt-1">Monitor user activity, earnings, and detect suspicious behavior.</p>
        </div>
        <button className="bg-saas-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Export CSV
        </button>
      </div>

      <div className="bg-saas-card border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-800">
            <tr>
              <th className="p-4 text-sm font-semibold text-saas-muted">User</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Role & Activity</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Financials</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Trust Score</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Status</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className={`transition ${u.trustScore < 30 ? 'bg-red-950/10 hover:bg-red-950/20' : 'hover:bg-slate-800/20'}`}>
                <td className="p-4">
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-saas-muted">{u.email}</p>
                </td>
                <td className="p-4">
                  <p className="capitalize font-medium text-blue-400">{u.role}</p>
                  <p className="text-xs text-saas-muted">
                    {u.role === 'tester' ? `${u.activeTests} active tests` : `${u.campaigns} campaigns`}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-mono text-emerald-400">{u.earnings || u.spent}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {u.trustScore >= 80 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    ) : u.trustScore < 30 ? (
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-500" />
                    )}
                    <span className={`font-bold ${u.trustScore >= 80 ? 'text-emerald-500' : u.trustScore < 30 ? 'text-red-500' : 'text-amber-500'}`}>
                      {u.trustScore}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' 
                    : u.status === 'flagged' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button className="text-saas-accent hover:text-blue-400 text-sm font-medium">Inspect</button>
                  {u.trustScore < 30 && (
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium">Ban</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
