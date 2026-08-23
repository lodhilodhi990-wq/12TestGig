import React from 'react';

export default function TesterAnalyticsDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Performance Insights</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Quality Score</h3>
          <p className="text-2xl font-bold text-blue-700">4.8 / 5.0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completed Tests</h3>
          <p className="text-2xl font-bold text-gray-900">42</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Valid Bugs</h3>
          <p className="text-2xl font-bold text-green-600">38</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Earned</h3>
          <p className="text-2xl font-bold text-gray-900">$840.00</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[300px] flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold mb-4 self-start">Earnings Over Time</h2>
        <p className="text-gray-400">[ Line Chart showing earnings per month ]</p>
      </div>
    </div>
  );
}
