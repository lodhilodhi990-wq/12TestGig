import React from 'react';

export default function SystemOperationsDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Health & Operations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Database Status</h3>
          <p className="text-xl font-bold text-gray-900">Healthy</p>
          <p className="text-xs text-gray-400 mt-1">Latency: 24ms</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Provider (Stripe)</h3>
          <p className="text-xl font-bold text-gray-900">Healthy</p>
          <p className="text-xs text-gray-400 mt-1">Webhooks responding</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-l-4 border-l-gray-300">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Sentry / Error Tracking</h3>
          <p className="text-xl font-bold text-gray-400">NOT CONFIGURED</p>
          <p className="text-xs text-gray-400 mt-1">Requires manual setup</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Feature Flags</h2>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-bold">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Blocks non-admin traffic.</p>
            </div>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300">
              Enable
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Infrastructure Tools</h2>
          <ul className="space-y-2">
            <li><a href="/admin/operations/payments" className="text-blue-600 hover:underline">Webhook & Payment Monitor</a></li>
            <li><a href="/admin/incidents" className="text-blue-600 hover:underline">Incident Management</a></li>
            <li><a href="/admin/releases" className="text-blue-600 hover:underline">Release History</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
