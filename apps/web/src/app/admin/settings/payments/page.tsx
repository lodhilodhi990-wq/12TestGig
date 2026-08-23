import React from 'react';

export default function AdminPaymentSettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment Provider Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Mock Provider (Active)</h2>
            <p className="text-gray-500 text-sm">Used for development and automated testing.</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Sandbox</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Webhook Status</span>
            <span className="text-green-600 font-semibold">Healthy</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Supported Currencies</span>
            <span>USD</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border opacity-75">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Stripe Connect</h2>
            <p className="text-gray-500 text-sm">Not configured.</p>
          </div>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-300">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
