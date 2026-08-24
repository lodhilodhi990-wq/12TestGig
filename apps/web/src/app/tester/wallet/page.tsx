'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Coins, 
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Building,
  CreditCard,
  Zap,
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { 
  subscribeToLivePricingRates, 
  DEFAULT_PRICING_RATES, 
  PricingRates,
  WithdrawalMethodDetail
} from '@/lib/pricingRates';

interface WithdrawalRecord {
  id: string;
  userId?: string;
  userName?: string;
  amountCoins: number;
  amountUsd: number;
  amountPkr: number;
  method: string;
  methodTitle: string;
  accountTitle: string;
  accountNumber: string;
  status: 'pending' | 'paid' | 'rejected';
  transactionId?: string;
  rejectionReason?: string;
  processingTime?: string;
  createdAt?: any;
}

export default function TesterWallet() {
  const { user, firebaseUser } = useAuth();
  const userId = firebaseUser?.uid || user?.id;

  const [rates, setRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);
  const [coinsBalance, setCoinsBalance] = useState<number>(0);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Withdrawal form states
  const [selectedMethodKey, setSelectedMethodKey] = useState<string>('jazzcash');
  const [accountTitle, setAccountTitle] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [withdrawCoins, setWithdrawCoins] = useState<number>(1000);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Withdrawal Queue for Current User
  const [userWithdrawals, setUserWithdrawals] = useState<WithdrawalRecord[]>([]);

  // 1. Subscribe to Pricing & Withdrawal settings
  useEffect(() => {
    const unsub = subscribeToLivePricingRates((liveRates) => {
      setRates(liveRates);
      // default selection if current is disabled
      if (liveRates.withdrawalMethods) {
        const methods = liveRates.withdrawalMethods;
        const availableKeys = Object.keys(methods).filter(k => (methods as any)[k]?.enabled);
        if (availableKeys.length > 0 && !(methods as any)[selectedMethodKey]?.enabled) {
          setSelectedMethodKey(availableKeys[0]);
        }
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // 2. Subscribe to user's real Firestore Coins Balance
  useEffect(() => {
    if (!userId) return;

    try {
      const unsubUser = onSnapshot(doc(db, 'users', userId), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const bal = data.coinsBalance !== undefined ? Number(data.coinsBalance) :
                      data.coins !== undefined ? Number(data.coins) : 0;
          setCoinsBalance(bal);
        }
      });
      return () => unsubUser();
    } catch (err) {
      console.warn('Balance listener notice:', err);
    }
  }, [userId]);

  // 3. Subscribe to user's live withdrawal requests
  useEffect(() => {
    if (!userId) {
      const saved = localStorage.getItem('user_withdrawals_history');
      if (saved) setUserWithdrawals(JSON.parse(saved));
      return;
    }

    try {
      const q = query(
        collection(db, 'withdrawal_requests'),
        where('userId', '==', userId)
      );

      const unsubW = onSnapshot(q, (snapshot) => {
        const list: WithdrawalRecord[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as WithdrawalRecord));
        
        // Sort newest first
        list.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });

        setUserWithdrawals(list);
        localStorage.setItem('user_withdrawals_history', JSON.stringify(list));
      }, (err) => {
        console.warn('Withdrawals query notice', err);
      });

      return () => unsubW();
    } catch (err) {
      console.warn('Withdrawals listener error:', err);
    }
  }, [userId]);

  // Allowed Withdrawal Methods from SaaS Settings
  const methodsConfig = rates.withdrawalMethods || DEFAULT_PRICING_RATES.withdrawalMethods!;
  const activeMethodsList = Object.entries(methodsConfig)
    .filter(([_, conf]) => conf.enabled)
    .map(([key, conf]) => ({ key, ...conf }));

  const currentMethod: WithdrawalMethodDetail = (methodsConfig as any)[selectedMethodKey] || methodsConfig.jazzcash;

  // Calculation for current withdrawal
  const minCoinsAllowed = currentMethod?.minCoins || rates.minWithdrawCoins || 500;
  const maxCoinsAllowed = currentMethod?.maxCoins || rates.maxWithdrawCoins || 50000;
  const feePercent = currentMethod?.feePercent ?? rates.withdrawalFeePercent ?? 0;
  
  const coinsPerUsd = rates.coinsPerUsd || 100;
  const pkrPerUsd = rates.pkrPerUsd || 280;
  const requestedUsd = withdrawCoins / coinsPerUsd;
  const requestedPkr = Math.round(requestedUsd * pkrPerUsd);
  const feeAmountPkr = Math.round((requestedPkr * feePercent) / 100);
  const netPkrToReceive = requestedPkr - feeAmountPkr;

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    // 1. Validation
    if (withdrawCoins < minCoinsAllowed) {
      setWithdrawError(`⚠️ Minimum withdrawal for ${currentMethod.title} is ${minCoinsAllowed.toLocaleString()} Coins (≈ $${(minCoinsAllowed/coinsPerUsd).toFixed(2)} USD).`);
      return;
    }

    if (withdrawCoins > maxCoinsAllowed) {
      setWithdrawError(`⚠️ Maximum withdrawal limit per request is ${maxCoinsAllowed.toLocaleString()} Coins.`);
      return;
    }

    if (withdrawCoins > coinsBalance) {
      const shortage = withdrawCoins - coinsBalance;
      setWithdrawError(`❌ Insufficient Balance! You have ${coinsBalance.toLocaleString()} Coins (Short by ${shortage.toLocaleString()} Coins).`);
      return;
    }

    if (!accountTitle.trim()) {
      setWithdrawError('⚠️ Please enter the exact Account Title / Full Name.');
      return;
    }

    if (!accountNumber.trim()) {
      setWithdrawError('⚠️ Please enter your Account Number / IBAN / Wallet ID.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBal = coinsBalance - withdrawCoins;
      const processingSLA = currentMethod.processingTime || rates.withdrawalProcessingTime || '1 to 24 Hours';

      // 2. Deduct coins from user's Firestore document
      if (userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          coinsBalance: newBal,
          coins: newBal,
          updatedAt: new Date().toISOString()
        });

        // 3. Write request to Firestore withdrawal_requests
        const newReqRef = await addDoc(collection(db, 'withdrawal_requests'), {
          userId: userId,
          userName: firebaseUser?.displayName || (user as any)?.displayName || (user as any)?.name || accountTitle,
          userEmail: firebaseUser?.email || user?.email || '',
          amountCoins: Number(withdrawCoins),
          amountUsd: Number(requestedUsd.toFixed(2)),
          amountPkr: Number(netPkrToReceive),
          grossPkr: Number(requestedPkr),
          feePercent: Number(feePercent),
          method: selectedMethodKey,
          methodTitle: currentMethod.title,
          accountTitle: accountTitle.trim(),
          accountNumber: accountNumber.trim(),
          processingTime: processingSLA,
          status: 'pending',
          createdAt: serverTimestamp(),
          submittedAt: new Date().toISOString()
        });

        const newRecord: WithdrawalRecord = {
          id: newReqRef.id,
          userId,
          userName: accountTitle,
          amountCoins: withdrawCoins,
          amountUsd: Number(requestedUsd.toFixed(2)),
          amountPkr: netPkrToReceive,
          method: selectedMethodKey,
          methodTitle: currentMethod.title,
          accountTitle: accountTitle.trim(),
          accountNumber: accountNumber.trim(),
          status: 'pending',
          processingTime: processingSLA,
          createdAt: new Date().toISOString()
        };

        const updatedHistory = [newRecord, ...userWithdrawals];
        setUserWithdrawals(updatedHistory);
        localStorage.setItem('user_withdrawals_history', JSON.stringify(updatedHistory));
      }

      setCoinsBalance(newBal);
      localStorage.setItem('user_coins_balance', String(newBal));

      setShowWithdraw(false);
      setAccountTitle('');
      setAccountNumber('');
      setWithdrawCoins(1000);

      alert(
        `🎉 WITHDRAWAL REQUEST SUBMITTED!\n\n` +
        `🪙 Amount: ${withdrawCoins.toLocaleString()} Coins\n` +
        `💵 Net Payout: Rs ${netPkrToReceive.toLocaleString()} PKR ($${requestedUsd.toFixed(2)} USD)\n` +
        `🏦 Method: ${currentMethod.title}\n` +
        `👤 Account: ${accountTitle} (${accountNumber})\n` +
        `⏳ Estimated Processing Time: ${currentMethod.processingTime || '1 to 24 Hours'}\n\n` +
        `You can track the live status in your transaction history below.`
      );
    } catch (err) {
      console.error('Withdrawal error:', err);
      setWithdrawError('Could not process withdrawal request. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pending coins currently in withdrawal escrow
  const pendingEscrowCoins = userWithdrawals
    .filter(w => w.status === 'pending')
    .reduce((acc, curr) => acc + Number(curr.amountCoins || 0), 0);

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Wallet className="w-6 h-6 text-blue-600" />
                Coin Wallet & Cash Payouts
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Manage your testing earnings, convert Coins to cash, and withdraw to Pakistani Wallets or Crypto.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Payout SLA: {rates.withdrawalProcessingTime || '1 to 24 Hours'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-zinc-800">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Coins className="w-36 h-36" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">Available Coins Balance</p>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    100 Coins = $1.00 USD
                  </span>
                </div>
                
                <div className="flex flex-wrap items-baseline gap-3 mt-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white">
                    {coinsBalance.toLocaleString()} <span className="text-2xl font-bold text-amber-400">Coins</span>
                  </h2>
                  <p className="text-emerald-400 font-bold text-sm border-l border-zinc-700 pl-3">
                    ≈ ${(coinsBalance / (rates.coinsPerUsd || 100)).toFixed(2)} USD (PKR {Math.round((coinsBalance / (rates.coinsPerUsd || 100)) * (rates.pkrPerUsd || 280)).toLocaleString()})
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      setWithdrawError(null);
                      setShowWithdraw(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Withdraw as Cash <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <Link 
                    href="/customer/billing"
                    className="px-6 py-3 bg-zinc-800/80 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition border border-zinc-700 flex items-center gap-2"
                  >
                    + Buy Coins (Deposit Funds)
                  </Link>
                </div>
              </div>
            </div>

            {/* Escrow/Pending */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Pending Payout Escrow</h3>
                <p className="text-3xl font-black text-zinc-900 mt-1">
                  {pendingEscrowCoins.toLocaleString()} <span className="text-sm font-bold text-amber-500">Coins</span>
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  ≈ PKR {Math.round((pendingEscrowCoins / (rates.coinsPerUsd || 100)) * (rates.pkrPerUsd || 280)).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-[11px] text-zinc-500 leading-relaxed mt-4">
                <p className="font-semibold text-zinc-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Processing SLA
                </p>
                Withdrawals are audited and paid within <strong>{rates.withdrawalProcessingTime || '1 to 24 Hours'}</strong> directly to your designated account.
              </div>
            </div>
          </div>

          {/* WITHDRAWAL HISTORY & REALTIME STATUS */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  Withdrawal Requests & Payout Queue
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">Live status of your submitted cashout requests</p>
              </div>
              <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-xl">
                {userWithdrawals.length} Total Requests
              </span>
            </div>

            {userWithdrawals.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-xs flex flex-col items-center justify-center">
                <Wallet className="w-8 h-8 mb-2 text-zinc-300" />
                <p className="font-semibold text-zinc-600">No withdrawal requests submitted yet.</p>
                <p className="text-zinc-400 mt-1">Complete app testing tasks to earn coins and cash out!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Request ID / Date</th>
                      <th className="px-6 py-4">Method & Account</th>
                      <th className="px-6 py-4">Coins Amount</th>
                      <th className="px-6 py-4">Net PKR / USD</th>
                      <th className="px-6 py-4">Status & Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {userWithdrawals.map(w => (
                      <tr key={w.id} className="hover:bg-zinc-50/80 transition">
                        <td className="px-6 py-4">
                          <p className="font-mono font-bold text-zinc-900">{w.id.slice(0, 8)}...</p>
                          <p className="text-[10px] text-zinc-400">
                            {w.createdAt?.seconds 
                              ? new Date(w.createdAt.seconds * 1000).toLocaleString() 
                              : 'Recently'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-zinc-900">{w.methodTitle}</p>
                          <p className="text-zinc-500 font-mono text-[11px]">{w.accountTitle} • {w.accountNumber}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-zinc-900 font-mono">
                          {Number(w.amountCoins).toLocaleString()} 🪙
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-emerald-600">Rs {Number(w.amountPkr || 0).toLocaleString()} PKR</p>
                          <p className="text-[10px] text-zinc-400">${Number(w.amountUsd || 0).toFixed(2)} USD</p>
                        </td>
                        <td className="px-6 py-4">
                          {w.status === 'paid' && (
                            <div>
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full inline-flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                              </span>
                              {w.transactionId && (
                                <p className="text-[10px] font-mono text-zinc-500 mt-1">TID: {w.transactionId}</p>
                              )}
                            </div>
                          )}

                          {w.status === 'pending' && (
                            <div>
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-[11px] rounded-full inline-flex items-center gap-1 border border-amber-200">
                                <Clock className="w-3.5 h-3.5 animate-spin" /> In Review
                              </span>
                              <p className="text-[10px] text-zinc-400 mt-0.5">ETA: {w.processingTime || '1-24 Hours'}</p>
                            </div>
                          )}

                          {w.status === 'rejected' && (
                            <div>
                              <span className="px-2.5 py-1 bg-red-50 text-red-700 font-extrabold text-[11px] rounded-full inline-flex items-center gap-1 border border-red-200">
                                <XCircle className="w-3.5 h-3.5" /> REJECTED
                              </span>
                              <p className="text-[10px] text-red-600 mt-0.5 font-medium">{w.rejectionReason || 'Coins refunded'}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ADVANCED WITHDRAWAL MODAL */}
          {showWithdraw && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-zinc-900">Withdraw Coins to Cash</h3>
                    <p className="text-xs text-zinc-500">Live conversion & official processing rates</p>
                  </div>
                  <button onClick={() => setShowWithdraw(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold cursor-pointer">✕</button>
                </div>

                {/* Available Balance Box */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Your Balance</p>
                    <p className="text-sm font-black text-zinc-900 font-mono">{coinsBalance.toLocaleString()} Coins</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estimated Cash</p>
                    <p className="text-sm font-black text-emerald-600">
                      Rs {Math.round((coinsBalance / (rates.coinsPerUsd || 100)) * (rates.pkrPerUsd || 280)).toLocaleString()} PKR
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {withdrawError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p>{withdrawError}</p>
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  {/* METHOD SELECTOR */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Select Payout Method ({activeMethodsList.length} Allowed)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeMethodsList.map(m => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => {
                            setSelectedMethodKey(m.key);
                            setWithdrawError(null);
                          }}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                            selectedMethodKey === m.key
                              ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm ring-1 ring-blue-600'
                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{m.title}</span>
                            {m.badge && (
                              <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            Min: {m.minCoins.toLocaleString()} 🪙 • SLA: {m.processingTime}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Method Instructions Note */}
                  {currentMethod && (
                    <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p>{currentMethod.instructions}</p>
                    </div>
                  )}

                  {/* ACCOUNT TITLE */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Account Title / Full Name
                    </label>
                    <input 
                      type="text" 
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      placeholder="e.g. Muhammad Ali" 
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>

                  {/* ACCOUNT NUMBER / IBAN / WALLET */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      {selectedMethodKey === 'usdtCrypto' 
                        ? 'USDT (TRC-20) Address or Binance Pay ID' 
                        : selectedMethodKey === 'payoneer'
                        ? 'Registered Payoneer Email Address'
                        : selectedMethodKey === 'bankTransfer'
                        ? 'Bank Name & IBAN / Account Number'
                        : 'Mobile Account Number (03001234567)'}
                    </label>
                    <input 
                      type="text" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder={
                        selectedMethodKey === 'usdtCrypto' 
                          ? 'e.g. T9yD14Nj9yDbvWzV...' 
                          : selectedMethodKey === 'payoneer'
                          ? 'e.g. name@example.com'
                          : selectedMethodKey === 'bankTransfer'
                          ? 'e.g. Meezan Bank PK64MEZN000000...'
                          : 'e.g. 03001234567'
                      }
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    />
                  </div>

                  {/* COINS AMOUNT & LIVE CONVERSION */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                      <span className="text-zinc-700 uppercase tracking-wider">Coins to Withdraw</span>
                      <span className="text-zinc-500">Min: {minCoinsAllowed.toLocaleString()} 🪙</span>
                    </div>
                    <input 
                      type="number" 
                      value={withdrawCoins}
                      onChange={(e) => {
                        setWithdrawCoins(Number(e.target.value));
                        setWithdrawError(null);
                      }}
                      min={minCoinsAllowed}
                      max={maxCoinsAllowed}
                      required
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  {/* SUMMARY BOX */}
                  <div className="p-4 rounded-2xl bg-zinc-900 text-white text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Withdrawal Amount:</span>
                      <span className="font-bold">{withdrawCoins.toLocaleString()} Coins (${requestedUsd.toFixed(2)} USD)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Processing Fee ({feePercent}%):</span>
                      <span className="font-bold text-zinc-300">Rs {feeAmountPkr.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Processing SLA Time:</span>
                      <span className="font-bold text-amber-400">{currentMethod.processingTime || '1 to 24 Hours'}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
                      <span className="font-bold text-zinc-200">Net You Will Receive:</span>
                      <span className="font-black text-emerald-400 text-base">Rs {netPkrToReceive.toLocaleString()} PKR</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowWithdraw(false)}
                      className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || withdrawCoins < minCoinsAllowed || withdrawCoins > coinsBalance}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        `Confirm & Request Payout`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
