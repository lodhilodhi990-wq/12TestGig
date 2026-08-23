import React from 'react';

export default function AdminReportsPage() {
  const previousJobs = [
    { id: 'job_1', type: 'withdrawals', status: 'completed', createdAt: '2023-11-20T10:00:00Z', url: '#' },
    { id: 'job_2', type: 'users', status: 'processing', createdAt: '2023-11-20T12:30:00Z', url: undefined },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report Builder</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-bold mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Report Type</label>
            <select className="w-full border p-2 rounded">
              <option>Users</option>
              <option>Testers</option>
              <option>Campaigns</option>
              <option>Withdrawals</option>
              <option>Bugs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <select className="w-full border p-2 rounded">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700">
              Generate CSV
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Recent Reports</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Report Type</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {previousJobs.map(job => (
              <tr key={job.id}>
                <td className="p-4 text-sm">{new Date(job.createdAt).toLocaleString()}</td>
                <td className="p-4 capitalize">{job.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {job.status === 'completed' ? (
                    <a href={job.url} className="text-blue-600 text-sm hover:underline">Download CSV</a>
                  ) : (
                    <span className="text-gray-400 text-sm">Processing...</span>
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
