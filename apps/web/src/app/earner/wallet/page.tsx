'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { ArrowUpRight, ArrowDownRight, Clock, Coins, Users, Wallet, CheckCircle2, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPartnerStats, PartnerStats } from '@/lib/referralService';
import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';

export default function EarnerWallet() {
  const { user } = useAuth();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [coinsBalance, setCoinsBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [pricingRates, setPricingRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);

  // Form State
  const [withdrawMethod, setWithdrawMethod] = useState('easypaisa');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToLivePricingRates((rates) => {
      setPricingRates(rates);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem('user_coins_balance');
      if (savedBalance) {
        setCoinsBalance(Number(savedBalance));
      } else {
        setCoinsBalance(0);
      }

      const savedTx = localStorage.getItem('user_wallet_transactions');
      if (savedTx) {
        setTransactions(JSON.parse(savedTx));
      } else {
        setTransactions([]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getPartnerStats(user).then((res) => setStats(res.stats));
    }
  }, [user]);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    if (withdrawAmount > coinsBalance) {
      alert('Insufficient coin balance!');
      return;
    }

    setIsSubmitting(true);
    const newBalance = coinsBalance - withdrawAmount;
    setCoinsBalance(newBalance);
    localStorage.setItem('user_coins_balance', newBalance.toString());

    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount: `-${withdrawAmount.toLocaleString()} 🪙`,
      desc: `Withdrawal to ${withdrawMethod.toUpperCase()} (${accountDetails})`,
      date: 'Just now',
      status: 'Processing'
    };

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem('user_wallet_transactions', JSON.stringify(updatedTx));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowWithdraw(false);
      alert(`Withdrawal request for ${withdrawAmount.toLocaleString()} Coins has been submitted! Payout will be processed within 24 hours.`);
    }, 500);
  };

  const balanceUsd = ((coinsBalance / (pricingRates.coinsPerUsd || 100))).toFixed(2);
  const balancePkr = Math.round(Number(balanceUsd) * (pricingRates.pkrPerUsd || 280)).toLocaleString();

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <EarnerLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
              <Wallet className="w-7 h-7 text-blue-600" />
              Partner Commission Wallet
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-1">
              Manage your referral commission Coins and withdraw cash directly to Easypaisa, JazzCash, Bank or Payoneer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-zinc-800">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Coins className="w-36 h-36" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">Available Coin Balance</p>
                <div className="flex flex-wrap items-baseline gap-3 mt-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white">
                    {coinsBalance.toLocaleString()} <span className="text-2xl font-bold text-amber-400">Coins</span>
                  </h2>
                  <p className="text-emerald-400 font-bold text-sm border-l border-zinc-700 pl-3">
                    ≈ ${balanceUsd} USD (PKR {balancePkr})
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setShowWithdraw(true)}
                    className="px-6 py-3 bg-white text-zinc-900 font-extrabold text-xs rounded-xl hover:bg-zinc-100 transition flex items-center gap-2 shadow"
                  >
                    Withdraw as Cash <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Referrals Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Total Recruits</h3>
                <p className="text-3xl font-black text-zinc-900 mt-1">{stats?.totalRecruits || 0}</p>
              </div>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                Active testers earning you lifetime recurring commission on every completed app test.
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                Transaction History
              </h2>
              <span className="text-xs text-zinc-400 font-medium">Automatic ledger records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-xs">
                No transactions yet. Complete test tasks or recruit testers to see your transaction activity here!
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-zinc-900">{tx.desc}</p>
                        <p className="text-[10px] text-zinc-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-xs ${tx.type === 'credit' ? 'text-emerald-600' : 'text-zinc-900'}`}>{tx.amount}</p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdraw Modal */}
          {showWithdraw && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-zinc-900">Withdraw Commission Coins</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>
                <p className="text-xs text-zinc-500 mb-5">
                  Available Balance: <strong className="text-zinc-900 font-bold">{coinsBalance.toLocaleString()} Coins</strong> (≈ ${balanceUsd} USD / PKR {balancePkr}).
                </p>

                <form onSubmit={handleWithdrawSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Select Withdrawal Method</label>
                    <select 
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="easypaisa">Easypaisa (Pakistan)</option>
                      <option value="jazzcash">JazzCash (Pakistan)</option>
                      <option value="bank">Bank Transfer / IBAN (PKR)</option>
                      <option value="payoneer">Payoneer (USD)</option>
                      <option value="binance">Binance Pay / USDT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Account / Mobile / Email Details</label>
                    <input 
                      type="text" 
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      placeholder="e.g. 03001234567 or Payoneer Email or IBAN" 
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Coins to Withdraw</label>
                    <input 
                      type="number" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      min={100}
                      max={coinsBalance > 0 ? coinsBalance : 100000}
                      required
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-emerald-600 font-bold mt-2 text-right">
                      You will receive approx: ${(withdrawAmount / (pricingRates.coinsPerUsd || 100)).toFixed(2)} USD (PKR {Math.round((withdrawAmount / (pricingRates.coinsPerUsd || 100)) * (pricingRates.pkrPerUsd || 280)).toLocaleString()})
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowWithdraw(false)}
                      className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || coinsBalance < withdrawAmount}
                      className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl transition shadow disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Payout'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
