import React from 'react';

export default function AdminAuditLogsPage() {
  const logs = [
    { id: 'aud_1', actor: 'admin_xyz', action: 'suspend_user', target: 'user_88', timestamp: '2023-11-20T14:30:00Z', reason: 'Repeated spam' },
    { id: 'aud_2', actor: 'system', action: 'flag_risk', target: 'w_129', timestamp: '2023-11-20T14:15:00Z', reason: 'High velocity payout' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      
      <div className="mb-4 flex space-x-2">
        <input type="text" placeholder="Search actor, target, or action..." className="border p-2 rounded w-64" />
        <input type="date" className="border p-2 rounded" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Timestamp</th>
              <th className="p-4 font-medium text-gray-500">Actor</th>
              <th className="p-4 font-medium text-gray-500">Action</th>
              <th className="p-4 font-medium text-gray-500">Target</th>
              <th className="p-4 font-medium text-gray-500">Reason / Context</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="p-4 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 font-mono text-sm text-blue-600">{log.actor}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-sm">{log.action}</span></td>
                <td className="p-4 font-mono text-sm">{log.target}</td>
                <td className="p-4 text-sm text-gray-700">{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
