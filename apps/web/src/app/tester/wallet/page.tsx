import React from 'react';
import { formatMoney } from '@/lib/formatters';

export default function TesterWalletPage() {
  // Mock data for UI placeholder
  const wallet = {
    availableBalanceMinor: 4500,
    pendingBalanceMinor: 1000,
    lifetimeEarnedMinor: 8000,
    lifetimeWithdrawnMinor: 2500,
  };

  const transactions = [
    { id: '1', type: 'Campaign Completion', amountMinor: 1000, date: '2023-10-01' },
    { id: '2', type: 'Bug Reward', amountMinor: 200, date: '2023-10-02' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="text-sm text-gray-500 mb-1">Available Balance</h2>
          <p className="text-2xl font-bold text-green-600">{formatMoney(wallet.availableBalanceMinor)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="text-sm text-gray-500 mb-1">Pending Balance</h2>
          <p className="text-2xl font-bold text-orange-500">{formatMoney(wallet.pendingBalanceMinor)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="text-sm text-gray-500 mb-1">Lifetime Earned</h2>
          <p className="text-2xl font-bold">{formatMoney(wallet.lifetimeEarnedMinor)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="text-sm text-gray-500 mb-1">Lifetime Withdrawn</h2>
          <p className="text-2xl font-bold">{formatMoney(wallet.lifetimeWithdrawnMinor)}</p>
        </div>
      </div>

      <div className="mb-8">
        <button 
          disabled
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Withdraw Funds
        </button>
        <p className="text-sm text-gray-500 mt-2">Withdrawals will be enabled once payment integration is complete.</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{tx.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{tx.type}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  +{formatMoney(tx.amountMinor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
