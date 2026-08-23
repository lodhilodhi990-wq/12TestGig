import React from 'react';

export default function CustomerAnalyticsDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Organization Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Budget Utilized</h3>
          <p className="text-2xl font-bold text-gray-900">$450 / $1000</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Valid Bugs Found</h3>
          <p className="text-2xl font-bold text-gray-900">124</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Testing Funnel (Current Campaign)</h2>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded">
          <div className="text-center">
            <p className="font-bold text-xl">100</p>
            <p className="text-sm text-gray-500">Assigned</p>
          </div>
          <div className="text-gray-300">→</div>
          <div className="text-center">
            <p className="font-bold text-xl">85</p>
            <p className="text-sm text-gray-500">Started</p>
          </div>
          <div className="text-gray-300">→</div>
          <div className="text-center">
            <p className="font-bold text-xl">72</p>
            <p className="text-sm text-gray-500">Submitted</p>
          </div>
          <div className="text-gray-300">→</div>
          <div className="text-center">
            <p className="font-bold text-xl text-green-600">68</p>
            <p className="text-sm text-green-600">Completed (Approved)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
