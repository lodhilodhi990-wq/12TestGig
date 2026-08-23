import React from 'react';
import { formatMoney } from '@/lib/formatters';

export default function AdminWithdrawalsPage() {
  const requests = [
    { id: 'w_3', tester: 'user_123', amount: 5000, fee: 100, net: 4900, status: 'requested', date: '2023-11-20' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Management</h1>
      
      <div className="mb-4 flex space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Requested (1)</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Processing (0)</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Completed (15)</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">ID</th>
              <th className="p-4 font-medium text-gray-500">Tester</th>
              <th className="p-4 font-medium text-gray-500">Net Amount</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map(r => (
              <tr key={r.id}>
                <td className="p-4">{r.id}</td>
                <td className="p-4">{r.tester}</td>
                <td className="p-4 font-bold text-green-600">{formatMoney(r.net)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button className="text-sm bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  <button className="text-sm bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
