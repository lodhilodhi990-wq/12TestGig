import React from 'react';

export default function AdminAIDashboard() {
  const requests = [
    { id: 'req_1', type: 'test_plan', org: 'org_abc', tokens: 450, status: 'completed', date: '2023-11-20' },
    { id: 'req_2', type: 'bug_assistant', org: 'org_xyz', tokens: 0, status: 'failed', date: '2023-11-19' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Usage & Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total API Requests (Month)</h3>
          <p className="text-2xl font-bold text-gray-900">12,450</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Provider</h3>
          <p className="text-xl font-bold text-green-600">MockAIProvider</p>
          <p className="text-xs text-gray-400 mt-1">Change via environment variables</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Rate Limiting</h3>
          <p className="text-xl font-bold text-gray-900">Active</p>
          <p className="text-xs text-gray-400 mt-1">Max 500 req / org / month</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Recent AI Generations</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Type</th>
              <th className="p-4 font-medium text-gray-500">Organization</th>
              <th className="p-4 font-medium text-gray-500">Tokens</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="p-4 text-sm">{req.date}</td>
                <td className="p-4 capitalize">{req.type.replace('_', ' ')}</td>
                <td className="p-4 font-mono text-sm">{req.org}</td>
                <td className="p-4">{req.tokens}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    req.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
