'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { ArrowUpRight, Clock, Coins, Users } from 'lucide-react';
import { useState } from 'react';

export default function EarnerWallet() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  const transactions = [
    { id: 1, type: 'credit', amount: '+1,500 🪙', desc: 'Commission: User test completed', date: 'Today, 2:30 PM', status: 'Completed' },
    { id: 2, type: 'withdrawal', amount: '-10,000 🪙', desc: 'Withdrawal to PayPal ($100.00)', date: 'Oct 20, 2023', status: 'Processing' },
    { id: 3, type: 'credit', amount: '+2,000 🪙', desc: 'Commission: User test completed', date: 'Oct 15, 2023', status: 'Completed' },
  ];

  return (
    <ProtectedRoute allowedRoles={['earner']}>
      <EarnerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Wallet</h1>
            <p className="text-zinc-500 mt-1">Manage your referral commission Coins and withdraw them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-2 bg-zinc-950 text-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Coins className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-400 font-medium">Available Coins</p>
                <div className="flex items-end gap-3 mt-2">
                  <h2 className="text-5xl font-bold">45,000 🪙</h2>
                  <p className="text-emerald-400 font-medium mb-1 border-l border-zinc-700 pl-3">≈ $450.00 USD</p>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => setShowWithdraw(true)}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2"
                  >
                    Withdraw as Cash <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Referrals */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-zinc-500 font-medium">Total Referrals</h3>
                <p className="text-3xl font-bold text-zinc-900 mt-1">12</p>
              </div>
              <p className="text-sm text-zinc-500 mt-4">Active testers earning you commission.</p>
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
                      {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
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

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Withdraw Coins</h3>
              <p className="text-zinc-500 mb-6">
                Your available balance is <strong>45,000 🪙</strong>. Enter the amount of Coins you wish to convert and withdraw to your linked bank account.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Select Withdrawal Method</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 font-medium">
                    <option value="easypaisa">Easypaisa</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank">Bank Transfer (PKR)</option>
                    <option value="payoneer">Payoneer (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Account Details</label>
                  <input type="text" placeholder="e.g. 0300-1234567 or IBAN" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Amount to Withdraw (in Coins)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">🪙</span>
                    <input 
                      type="number" 
                      placeholder="5000" 
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-2 text-right">You will receive approx: $50.00 USD</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Withdrawal requested via selected method! It may take 2-3 business days to process.');
                    setShowWithdraw(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-xl transition-colors"
                >
                  Confirm Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </EarnerLayout>
    </ProtectedRoute>
  );
}
