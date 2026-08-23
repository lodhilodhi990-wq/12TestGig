export default function Users() {
  const users = [
    { id: 'usr_1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active' },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane@example.com', role: 'tester', status: 'active' },
    { id: 'usr_3', name: 'Alice Jones', email: 'alice@example.com', role: 'tester', status: 'suspended' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Platform Users</h1>
        <button className="bg-saas-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Export CSV
        </button>
      </div>

      <div className="bg-saas-card border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-800">
            <tr>
              <th className="p-4 text-sm font-semibold text-saas-muted">Name</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Email</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Role</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Status</th>
              <th className="p-4 text-sm font-semibold text-saas-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/20 transition">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-saas-muted">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-saas-accent hover:text-blue-400 text-sm font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
