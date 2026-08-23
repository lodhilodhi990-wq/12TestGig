import React from 'react';

export default function IncidentManagementDashboard() {
  const incidents = [
    { id: 'inc_1', title: 'Stripe Webhook Degradation', severity: 'SEV2', status: 'investigating', date: '2023-11-20' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incident Management</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Declare Incident</button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Title</th>
              <th className="p-4 font-medium text-gray-500">Severity</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td className="p-4 text-sm">{inc.date}</td>
                <td className="p-4 font-medium">{inc.title}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 font-bold">{inc.severity}</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-bold capitalize">
                    {inc.status}
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
