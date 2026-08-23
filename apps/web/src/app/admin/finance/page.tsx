import React from 'react';
import { formatMoney } from '@/lib/formatters';

export default function AdminFinancePage() {
  const stats = {
    totalRewards: 50000,
    pendingRewards: 2500,
    approvedRewards: 47500,
    cancelledRewards: 1000,
    totalTesterBalances: 30000,
    totalWithdrawn: 17500
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Finance Monitor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <h2 className="text-sm text-gray-500 mb-1">Total Rewards</h2>
          <p className="text-2xl font-bold text-gray-900">{formatMoney(stats.totalRewards)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <h2 className="text-sm text-gray-500 mb-1">Pending Rewards</h2>
          <p className="text-2xl font-bold text-orange-500">{formatMoney(stats.pendingRewards)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <h2 className="text-sm text-gray-500 mb-1">Total Tester Balances</h2>
          <p className="text-2xl font-bold text-blue-600">{formatMoney(stats.totalTesterBalances)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <h2 className="text-sm text-gray-500 mb-1">Total Withdrawn</h2>
          <p className="text-2xl font-bold text-green-600">{formatMoney(stats.totalWithdrawn)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border mb-8">
        <h2 className="text-lg font-bold mb-4">Manual Adjustment</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Tester ID" className="border rounded p-2" />
          <select className="border rounded p-2">
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <input type="number" placeholder="Amount (cents)" className="border rounded p-2" />
          <button className="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700">Apply Adjustment</button>
        </div>
      </div>
    </div>
  );
}
