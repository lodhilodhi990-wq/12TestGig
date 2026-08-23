import React from 'react';

export default function AdminAnalyticsDashboard() {
  const stats = [
    { label: 'Active Users', value: '1,245', trend: '+12%' },
    { label: 'Active Campaigns', value: '42', trend: '+3%' },
    { label: 'Running Tests', value: '3,890', trend: '+24%' },
    { label: 'Total Rewards Disbursed', value: '$12,450', trend: '+8%' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <select className="border p-2 rounded">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.label}</h3>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className="text-sm font-medium text-green-600">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">[ User Growth Chart Placeholder ]</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">[ Bug Validity Ratio Donut Chart ]</p>
        </div>
      </div>
    </div>
  );
}
