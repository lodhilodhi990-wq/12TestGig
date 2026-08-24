'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  CreditCard, 
  Coins, 
  Upload, 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Building, 
  ShieldCheck,
  Trash2,
  Sparkles,
  Zap,
  Award,
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';

interface PaymentMethod {
  id: string;
  type: 'card' | 'easypaisa' | 'jazzcash' | 'bank' | 'payoneer';
  title: string;
  details: string;
  isDefault: boolean;
}

export default function CustomerBilling() {
  const [rates, setRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);
  const [coinsBalance, setCoinsBalance] = useState<number>(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [selectedPlanCoins, setSelectedPlanCoins] = useState<number>(2000);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm_1', type: 'card', title: 'Visa Card', details: 'ending in 4242 (Exp 12/26)', isDefault: true },
    { id: 'pm_2', type: 'easypaisa', title: 'Easypaisa Account', details: '0300-1234567 (Personal)', isDefault: false },
  ]);

  const [newMethodType, setNewMethodType] = useState<'card' | 'easypaisa' | 'jazzcash' | 'bank'>('card');
  const [newMethodNumber, setNewMethodNumber] = useState('');
  const [newMethodName, setNewMethodName] = useState('');

  // Deposit Form
  const [depositAmountUsd, setDepositAmountUsd] = useState<number>(20);
  const [depositMethod, setDepositMethod] = useState<'easypaisa' | 'bank' | 'payoneer' | 'usdt'>('easypaisa');
  const [senderAccount, setSenderAccount] = useState('');
  const [depositSubmitted, setDepositSubmitted] = useState(false);

  useEffect(() => {
    // 1. Subscribe to live rates set in SaaS Admin panel
    const unsub = subscribeToLivePricingRates((liveRates) => {
      setRates(liveRates);
    });

    // 2. Read live balance from localStorage
    try {
      const savedBalance = localStorage.getItem('user_coins_balance');
      if (savedBalance) {
        setCoinsBalance(Number(savedBalance));
      } else {
        setCoinsBalance(0);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleSelectPlan = (coins: number) => {
    setSelectedPlanCoins(coins);
    setDepositAmountUsd(coins / rates.coinsPerUsd);
    setShowDeposit(true);
  };

  const handleAddNewMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodNumber) return;

    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: newMethodType,
      title: newMethodType === 'card' ? 'Credit/Debit Card' : newMethodType === 'easypaisa' ? 'Easypaisa' : newMethodType === 'jazzcash' ? 'JazzCash' : 'Bank Account',
      details: `${newMethodNumber} (${newMethodName || 'Personal'})`,
      isDefault: false
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddMethodForm(false);
    setNewMethodNumber('');
    setNewMethodName('');
    alert('Payment method added successfully!');
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSubmitted(true);
    setTimeout(() => {
      setDepositSubmitted(false);
      setShowDeposit(false);
      alert(`Receipt submitted! ${Math.round(depositAmountUsd * rates.coinsPerUsd).toLocaleString()} Coins will be credited to your account after verification by the admin.`);
    }, 1000);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Test Pack',
      coins: 1000,
      badge: 'Quick Test',
      description: 'Ideal for 10 testers for 7 days quick audit.',
      popular: false
    },
    {
      id: 'playstore',
      name: 'Google Play 14-Day Pack',
      coins: rates.base20TesterCost || 2000,
      badge: 'Recommended by Google',
      description: 'Full 20 verified testers for 14 continuous days to meet Google Play Console requirements.',
      popular: true
    },
    {
      id: 'growth',
      name: 'Growth Multi-App Pack',
      coins: 5000,
      badge: 'Best Value',
      description: 'Test 2-3 apps simultaneously with 20+ testers.',
      popular: false
    },
    {
      id: 'agency',
      name: 'Enterprise Agency Suite',
      coins: 10000,
      badge: 'VIP Coverage',
      description: 'High volume app testing for studios and developer agencies.',
      popular: false
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <CustomerLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Coins className="w-6 h-6 text-amber-500" />
                Coin Plans, Pricing & Payment Methods
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Official platform coin rates synced live with the SaaS Admin Panel.
              </p>
            </div>

            {/* Live Exchange Rate Pill */}
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div className="text-xs">
                <span className="text-zinc-600 font-bold">Official Rate: </span>
                <strong className="text-amber-700 font-black">1 Coin = ${(1 / rates.coinsPerUsd).toFixed(2)} USD</strong>
                <span className="text-zinc-400 mx-1.5">|</span>
                <strong className="text-emerald-700 font-black">PKR {(rates.pkrPerUsd / rates.coinsPerUsd).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Balance & Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-zinc-800">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Coins className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase">Your Available Balance</p>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mt-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white">
                    {coinsBalance.toLocaleString()} <span className="text-xl md:text-2xl font-extrabold text-amber-400">Coins</span>
                  </h2>
                  <p className="text-emerald-400 font-bold text-sm border-l border-zinc-700 pl-3">
                    ≈ ${(coinsBalance / rates.coinsPerUsd).toFixed(2)} USD (PKR {Math.round((coinsBalance / rates.coinsPerUsd) * rates.pkrPerUsd).toLocaleString()})
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setShowDeposit(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Buy Coins (Deposit)
                  </button>
                  <button 
                    onClick={() => setShowPaymentMethodsModal(true)}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition border border-zinc-700"
                  >
                    Manage Payment Methods
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Payment Methods Box */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Saved Accounts
                  </h2>
                  <button 
                    onClick={() => { setShowPaymentMethodsModal(true); setShowAddMethodForm(true); }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-2.5">
                  {paymentMethods.map(pm => (
                    <div key={pm.id} className="border border-zinc-200 rounded-2xl p-3 flex items-center justify-between bg-zinc-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-xs font-bold shadow-sm">
                          {pm.type === 'card' ? '💳' : '📱'}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-900">{pm.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{pm.details}</p>
                        </div>
                      </div>
                      {pm.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setShowPaymentMethodsModal(true); setShowAddMethodForm(true); }}
                className="text-xs font-bold text-blue-600 hover:underline mt-4 text-left block"
              >
                + Add Card, Easypaisa or Bank
              </button>
            </div>
          </div>

          {/* OFFICIAL COIN PLANS CONFIGURED IN SAAS PANEL */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Available Coin Packages & Pricing Plans
              </h2>
              <p className="text-xs text-zinc-500">
                Choose a pre-configured plan to launch your Google Play closed test or buy custom coins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map(plan => {
                const usdCost = (plan.coins / rates.coinsPerUsd).toFixed(2);
                const pkrCost = Math.round((plan.coins / rates.coinsPerUsd) * rates.pkrPerUsd).toLocaleString();

                return (
                  <div 
                    key={plan.id}
                    className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                      plan.popular 
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20' 
                        : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-full">
                        {plan.badge}
                      </span>
                      <h3 className="text-base font-extrabold text-zinc-900 mt-2">{plan.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed min-h-[36px]">{plan.description}</p>

                      <div className="my-5 pt-4 border-t border-zinc-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-zinc-900">{plan.coins.toLocaleString()}</span>
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Coins</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">
                          ${usdCost} USD <span className="text-zinc-400 font-normal">/ Rs {pkrCost} PKR</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSelectPlan(plan.coins)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-zinc-900 hover:bg-black text-white'
                      }`}
                    >
                      Buy This Plan <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEPOSIT / BUY COINS MODAL (SHOWING LIVE SAAS ADMIN ACCOUNTS) */}
          {showDeposit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">Buy Coins & Deposit Funds</h3>
                    <p className="text-xs text-zinc-500">Live Rate: $1.00 USD = {rates.coinsPerUsd} Coins (1 Coin = PKR {(rates.pkrPerUsd / rates.coinsPerUsd).toFixed(2)})</p>
                  </div>
                  <button onClick={() => setShowDeposit(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <form onSubmit={handleDepositSubmit} className="space-y-5 mb-6">
                  {/* Amount Selector */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Amount in USD ($)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min={rates.minDepositUsd || 5}
                        value={depositAmountUsd}
                        onChange={(e) => setDepositAmountUsd(Number(e.target.value))}
                        required
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                        = {Math.round(depositAmountUsd * rates.coinsPerUsd).toLocaleString()} Coins
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Equivalent in PKR: <strong>Rs {Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} PKR</strong>
                    </p>
                  </div>

                  {/* ADMIN RECEIVING ACCOUNTS FETCHED LIVE FROM SAAS PANEL */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Select Deposit Method & Send Payment
                    </label>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setDepositMethod('easypaisa')}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
                          depositMethod === 'easypaisa' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        📱 Easypaisa / JazzCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositMethod('bank')}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
                          depositMethod === 'bank' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        🏦 Local Bank (PKR)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositMethod('payoneer')}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
                          depositMethod === 'payoneer' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        🌐 Payoneer (USD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositMethod('usdt')}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
                          depositMethod === 'usdt' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        ₮ USDT / Binance Pay
                      </button>
                    </div>

                    {/* LIVE ACCOUNT DETAILS FROM SAAS PANEL */}
                    <div className="p-4 bg-zinc-900 text-white rounded-2xl text-xs space-y-1 font-mono">
                      {depositMethod === 'easypaisa' && (
                        <>
                          <p className="text-zinc-400 uppercase text-[10px]">Send PKR to Easypaisa / JazzCash:</p>
                          <p className="text-sm font-bold text-emerald-400">{rates.easypaisaNumber}</p>
                          <p className="text-xs text-zinc-300">Account Title: {rates.easypaisaTitle}</p>
                          <p className="text-xs text-amber-300 mt-1">Total to send: Rs {Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} PKR</p>
                        </>
                      )}

                      {depositMethod === 'bank' && (
                        <>
                          <p className="text-zinc-400 uppercase text-[10px]">Send PKR to Local Bank Transfer:</p>
                          <p className="text-sm font-bold text-emerald-400">{rates.bankDetails}</p>
                          <p className="text-xs text-amber-300 mt-1">Total to send: Rs {Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} PKR</p>
                        </>
                      )}

                      {depositMethod === 'payoneer' && (
                        <>
                          <p className="text-zinc-400 uppercase text-[10px]">Send USD to Payoneer Email:</p>
                          <p className="text-sm font-bold text-emerald-400">{rates.payoneerEmail}</p>
                          <p className="text-xs text-amber-300 mt-1">Total to send: ${depositAmountUsd} USD</p>
                        </>
                      )}

                      {depositMethod === 'usdt' && (
                        <>
                          <p className="text-zinc-400 uppercase text-[10px]">Send USDT TRC20 / Binance Pay:</p>
                          <p className="text-xs font-bold text-emerald-400 break-all">{rates.usdtAddress}</p>
                          <p className="text-xs text-amber-300 mt-1">Total to send: ${depositAmountUsd} USDT</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Transaction ID / Sender Account */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Your Sender Account / Transaction ID (TID)
                    </label>
                    <input 
                      type="text" 
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      placeholder="e.g. Transaction ID: 123456789 or 0300XXXXXXX"
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Screenshot Upload Box */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Upload Payment Receipt Screenshot (Optional)
                    </label>
                    <div className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition">
                      <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold">Click to attach screenshot proof</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowDeposit(false)}
                      className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={depositSubmitted}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {depositSubmitted ? 'Submitting...' : 'Submit Payment Proof'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PAYMENT METHODS MODAL */}
          {showPaymentMethodsModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-zinc-900">Manage Payment Methods</h3>
                  <button onClick={() => setShowPaymentMethodsModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                {!showAddMethodForm ? (
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      {paymentMethods.map(pm => (
                        <div key={pm.id} className="border border-zinc-200 rounded-2xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{pm.type === 'card' ? '💳' : '📱'}</span>
                            <div>
                              <p className="font-bold text-xs text-zinc-900">{pm.title}</p>
                              <p className="text-[11px] text-zinc-500 font-mono">{pm.details}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteMethod(pm.id)}
                            className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowAddMethodForm(true)}
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add New Payment Method
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddNewMethod} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Method Type</label>
                      <select 
                        value={newMethodType} 
                        onChange={(e: any) => setNewMethodType(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="card">Credit / Debit Card</option>
                        <option value="easypaisa">Easypaisa (Pakistan)</option>
                        <option value="jazzcash">JazzCash (Pakistan)</option>
                        <option value="bank">Bank Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Card Number / Mobile Number / IBAN
                      </label>
                      <input 
                        type="text" 
                        value={newMethodNumber}
                        onChange={(e) => setNewMethodNumber(e.target.value)}
                        placeholder="e.g. 4242•••• or 03001234567"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Account Holder Name</label>
                      <input 
                        type="text" 
                        value={newMethodName}
                        onChange={(e) => setNewMethodName(e.target.value)}
                        placeholder="e.g. Umar Hayat"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddMethodForm(false)}
                        className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-xl"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
                      >
                        Save Method
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
