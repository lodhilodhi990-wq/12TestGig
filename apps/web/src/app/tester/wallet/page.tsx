'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import TesterLayout from '@/components/TesterLayout';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Building } from 'lucide-react';

export default function TesterWallet() {
  const transactions = [
    { id: 1, type: 'credit', amount: '+$15.00', desc: 'Reward: Fitness Tracker Pro', date: 'Today, 2:30 PM', status: 'Completed' },
    { id: 2, type: 'withdrawal', amount: '-$50.00', desc: 'Withdrawal to Bank ****1234', date: 'Oct 20, 2023', status: 'Processing' },
    { id: 3, type: 'credit', amount: '+$12.00', desc: 'Reward: Meditation App', date: 'Oct 15, 2023', status: 'Completed' },
  ];

  return (
    <ProtectedRoute allowedRoles={['tester']}>
      <TesterLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Wallet</h1>
            <p className="text-zinc-500 mt-1">Manage your earnings and withdraw funds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-2 bg-zinc-950 text-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-400 font-medium">Available Balance</p>
                <h2 className="text-5xl font-bold mt-2">$120.00</h2>
                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    Withdraw Funds <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Escrow/Pending */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-zinc-500 font-medium">Pending in Escrow</h3>
                <p className="text-3xl font-bold text-zinc-900 mt-1">$35.00</p>
              </div>
              <p className="text-sm text-zinc-500 mt-4">Funds from active tests will be available upon completion.</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">Transaction History</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {transactions.map(tx => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'}`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{tx.desc}</p>
                      <p className="text-sm text-zinc-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-zinc-900'}`}>{tx.amount}</p>
                    <p className="text-xs text-zinc-500 mt-1">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TesterLayout>
    </ProtectedRoute>
  );
}
