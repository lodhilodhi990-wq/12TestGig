import React from 'react';
import { formatMoney } from '@/lib/formatters';

export default function TesterWithdrawalsPage() {
  const withdrawals = [
    { id: 'w_1', date: '2023-11-01', gross: 5000, fee: 100, net: 4900, status: 'completed', method: 'Bank (**** 1234)' },
    { id: 'w_2', date: '2023-11-15', gross: 2500, fee: 50, net: 2450, status: 'processing', method: 'PayPal' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Withdrawal History</h1>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payout</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.map((w) => (
              <tr key={w.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(w.gross)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">-{formatMoney(w.fee)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatMoney(w.net)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{w.method}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${w.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      w.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {w.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
