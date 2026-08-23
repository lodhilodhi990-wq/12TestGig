import React from 'react';

export default function AdminDisputesPage() {
  const disputes = [
    { id: 'disp_1', type: 'reward', priority: 'high', status: 'open', openedBy: 'tester_123', subject: 'Missing daily reward' },
    { id: 'disp_2', type: 'bug', priority: 'normal', status: 'under_review', openedBy: 'tester_456', subject: 'Bug marked invalid incorrectly' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dispute Management</h1>
      
      <div className="mb-4 flex space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Open (2)</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Under Review (1)</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Resolved (45)</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">ID</th>
              <th className="p-4 font-medium text-gray-500">Subject</th>
              <th className="p-4 font-medium text-gray-500">Type</th>
              <th className="p-4 font-medium text-gray-500">Priority</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {disputes.map(d => (
              <tr key={d.id}>
                <td className="p-4 font-mono text-sm">{d.id}</td>
                <td className="p-4">{d.subject}</td>
                <td className="p-4">{d.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    d.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {d.priority.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                    {d.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-100">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
