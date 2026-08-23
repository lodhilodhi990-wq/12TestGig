import React from 'react';

export default function AdminOverviewDashboard() {
  // In a real implementation, these would be Server Components fetching from adminDb.collection('...').count()
  const stats = [
    { label: 'Total Users', value: 1250 },
    { label: 'Active Campaigns', value: 45 },
    { label: 'Open Disputes', value: 12, alert: true },
    { label: 'Risk Alerts', value: 3, alert: true },
    { label: 'Pending Withdrawals', value: 8 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Control Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-lg shadow-sm border ${stat.alert ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.label}</h3>
            <p className={`text-2xl font-bold ${stat.alert ? 'text-red-700' : 'text-gray-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Recent Audit Activity</h2>
          <ul className="space-y-3">
            <li className="text-sm border-b pb-2"><span className="font-semibold">admin_1</span> suspended user <span className="font-mono">test_88</span></li>
            <li className="text-sm border-b pb-2"><span className="font-semibold">system</span> flagged high-risk payout <span className="font-mono">w_129</span></li>
            <li className="text-sm text-gray-500">View all logs...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
