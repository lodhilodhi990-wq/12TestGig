import React from 'react';

export default function AdminSystemHealthPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Health & Settings</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <h2 className="text-lg font-bold mb-2">Firestore Database</h2>
          <p className="text-green-600 font-semibold">Healthy</p>
          <p className="text-sm text-gray-500 mt-2">Latency: ~45ms</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <h2 className="text-lg font-bold mb-2">Payment Webhooks</h2>
          <p className="text-green-600 font-semibold">Healthy</p>
          <p className="text-sm text-gray-500 mt-2">Last event: 10 mins ago</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Email Notifications</h2>
          <p className="text-gray-600 font-semibold">Not Configured</p>
          <p className="text-sm text-gray-500 mt-2">FCM Push is active.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
          <h2 className="text-lg font-bold mb-2">Application Errors</h2>
          <p className="text-red-600 font-semibold">2 Critical Errors</p>
          <p className="text-sm text-gray-500 mt-2">Last error: Cannot resolve missing dependency</p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">View Logs</button>
        </div>
      </div>
    </div>
  );
}
