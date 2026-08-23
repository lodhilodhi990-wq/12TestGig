import React from 'react';

export default function CustomerPlayStoreDashboard() {
  const items = [
    { id: '1', category: 'Testing', title: 'Closed Testing Track', status: 'in_progress', required: true },
    { id: '2', category: 'Privacy', title: 'Privacy Policy URL', status: 'completed', required: true },
    { id: '3', category: 'App Identity', title: 'App Icon (512x512)', status: 'not_started', required: false },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold">Play Store Readiness Checklist</h1>
          <p className="text-gray-500 text-sm mt-1">Track your progress toward Google Play compliance. (Advisory Only)</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 mb-1">Readiness Score</p>
          <p className="text-3xl font-bold text-blue-600">50%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  {item.required && <span className="text-xs bg-red-100 text-red-700 px-2 rounded">Required</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>
              </div>
              <div>
                <select 
                  className={`border p-1 rounded text-sm font-semibold ${
                    item.status === 'completed' ? 'bg-green-50 text-green-700' : 
                    item.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'
                  }`}
                  defaultValue={item.status}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
