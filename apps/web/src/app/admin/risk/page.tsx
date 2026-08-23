import React from 'react';

export default function AdminRiskPage() {
  const events = [
    { id: 'risk_1', user: 'tester_88', type: 'repeated_failed_payouts', severity: 'critical', status: 'open', date: '2023-11-20' },
    { id: 'risk_2', user: 'tester_102', type: 'duplicate_submissions', severity: 'medium', status: 'reviewing', date: '2023-11-19' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Risk & Fraud Prevention</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Event ID</th>
              <th className="p-4 font-medium text-gray-500">User / Target</th>
              <th className="p-4 font-medium text-gray-500">Risk Type</th>
              <th className="p-4 font-medium text-gray-500">Severity</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.map(e => (
              <tr key={e.id}>
                <td className="p-4 font-mono text-sm">{e.id}</td>
                <td className="p-4">{e.user}</td>
                <td className="p-4">{e.type.replace(/_/g, ' ')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded font-bold ${
                    e.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-yellow-200 text-yellow-900'
                  }`}>
                    {e.severity.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-700">{e.status}</span>
                </td>
                <td className="p-4 space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Investigate</button>
                  <button className="text-sm text-red-600 hover:underline">Suspend User</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
