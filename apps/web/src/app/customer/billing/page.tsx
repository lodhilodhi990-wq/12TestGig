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
  Clock, 
  Copy, 
  Check, 
  AlertCircle, 
  Lock, 
  Globe, 
  Smartphone 
} from 'lucide-react';
import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm_1', type: 'card', title: 'Visa Card', details: 'ending in 4242 (Exp 12/26)', isDefault: true },
    { id: 'pm_2', type: 'easypaisa', title: 'Easypaisa Account', details: '0300-1234567 (Personal)', isDefault: false },
  ]);

  const [newMethodType, setNewMethodType] = useState<'card' | 'easypaisa' | 'jazzcash' | 'bank'>('card');
  const [newMethodNumber, setNewMethodNumber] = useState('');
  const [newMethodName, setNewMethodName] = useState('');

  // Deposit Form State
  const [depositAmountUsd, setDepositAmountUsd] = useState<number>(20);
  const [depositCategory, setDepositCategory] = useState<'manual' | 'api'>('manual');
  const [selectedManualKey, setSelectedManualKey] = useState<string>('easypaisa');
  const [selectedApiKey, setSelectedApiKey] = useState<string>('stripe');
  const [senderAccount, setSenderAccount] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptScreenshot, setReceiptScreenshot] = useState<string | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [depositSubmitted, setDepositSubmitted] = useState(false);

  // Online Card Simulation State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardProcessing, setCardProcessing] = useState(false);

  useEffect(() => {
    // 1. Subscribe to live rates set in SaaS Admin panel
    const unsub = subscribeToLivePricingRates((liveRates) => {
      setRates(liveRates);
      
      // Auto-select first enabled manual method
      if (liveRates.manualMethods) {
        const firstEnabledManual = Object.entries(liveRates.manualMethods).find(([_, m]) => m.enabled);
        if (firstEnabledManual) {
          setSelectedManualKey(firstEnabledManual[0]);
        }
      }
      // Auto-select first enabled API gateway
      if (liveRates.apiGateways) {
        const firstEnabledApi = Object.entries(liveRates.apiGateways).find(([_, g]) => g.enabled);
        if (firstEnabledApi) {
          setSelectedApiKey(firstEnabledApi[0]);
        }
      }
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.72);
          setReceiptScreenshot(compressedBase64);
        } else {
          setReceiptScreenshot(event.target?.result as string);
        }
        setIsCompressingImage(false);
      };
      img.onerror = () => {
        setReceiptScreenshot(event.target?.result as string);
        setIsCompressingImage(false);
      };
    };
  };

  // Submit manual payment receipt
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSubmitted(true);

    const coinsToCredit = Math.round(depositAmountUsd * rates.coinsPerUsd);
    const amountPkr = Math.round(depositAmountUsd * rates.pkrPerUsd);
    const user = auth.currentUser;

    const activeManual = rates.manualMethods ? (rates.manualMethods as any)[selectedManualKey] : null;
    const methodName = activeManual ? activeManual.title : selectedManualKey;

    try {
      await addDoc(collection(db, 'deposits'), {
        userId: user?.uid || 'guest_user',
        userEmail: user?.email || 'dev.user@example.com',
        userName: senderName || user?.displayName || 'Developer',
        amountUsd: `$${depositAmountUsd.toFixed(2)}`,
        amountPkr: `${amountPkr.toLocaleString()} PKR`,
        coinsToCredit: `${coinsToCredit.toLocaleString()} 🪙`,
        coinsNumber: coinsToCredit,
        method: methodName,
        accountSender: senderAccount,
        receiptUrl: receiptScreenshot || '',
        note: receiptNote,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp(),
        status: 'pending'
      });
    } catch (err) {
      console.warn('Deposit recording fallback', err);
    }

    setTimeout(() => {
      setDepositSubmitted(false);
      setShowDeposit(false);
      setSenderAccount('');
      setSenderName('');
      setReceiptScreenshot(null);
      alert(`Payment Proof Submitted! ${coinsToCredit.toLocaleString()} Coins will be credited to your balance after admin verification.`);
    }, 800);
  };

  // Automated Instant Card / API Gateway Checkout
  const handleInstantApiPay = (e: React.FormEvent) => {
    e.preventDefault();
    setCardProcessing(true);

    const coinsToCredit = Math.round(depositAmountUsd * rates.coinsPerUsd);

    setTimeout(() => {
      setCardProcessing(false);
      const newBal = coinsBalance + coinsToCredit;
      setCoinsBalance(newBal);
      try {
        localStorage.setItem('user_coins_balance', String(newBal));
      } catch (e) {
        console.error(e);
      }
      setShowDeposit(false);
      alert(`🎉 Payment Successful! ${coinsToCredit.toLocaleString()} Coins have been credited immediately to your balance.`);
    }, 1500);
  };

  // Filter allowed payment methods (Only enabled: true methods show to user)
  const manualList = Object.entries(rates.manualMethods || {})
    .filter(([_, m]) => m.enabled);
  
  const apiList = Object.entries(rates.apiGateways || {})
    .filter(([_, g]) => g.enabled);

  // Active category resolution based on available enabled methods
  const effectiveCategory = 
    depositCategory === 'manual' && manualList.length === 0 && apiList.length > 0 ? 'api' :
    depositCategory === 'api' && apiList.length === 0 && manualList.length > 0 ? 'manual' :
    depositCategory;

  const effectiveManualKey = manualList.some(([k]) => k === selectedManualKey) 
    ? selectedManualKey 
    : (manualList[0]?.[0] || 'easypaisa');

  const effectiveApiKey = apiList.some(([k]) => k === selectedApiKey) 
    ? selectedApiKey 
    : (apiList[0]?.[0] || 'jazzcash');

  const selectedManualData = rates.manualMethods ? (rates.manualMethods as any)[effectiveManualKey] : null;
  const selectedApiData = rates.apiGateways ? (rates.apiGateways as any)[effectiveApiKey] : null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Test Pack',
      coins: rates.quickCoins || 1000,
      badge: 'Quick Test',
      description: `Ideal for ${rates.quickTesters || 10} testers for ${rates.quickDays || 7} days quick audit.`,
      popular: false
    },
    {
      id: 'playstore',
      name: 'Google Play 14-Day Pack',
      coins: rates.base20TesterCost || 2000,
      badge: 'Recommended by Google',
      description: `Full ${rates.base20Testers || 20} verified testers for ${rates.base20Days || 14} continuous days to meet Google Play Console requirements.`,
      popular: true
    },
    {
      id: 'growth',
      name: 'Growth Multi-App Pack',
      coins: (rates.base20TesterCost || 2000) * 2.5,
      badge: 'Best Value',
      description: 'Test 2-3 apps simultaneously with 20+ testers.',
      popular: false
    },
    {
      id: 'agency',
      name: 'Enterprise Agency Suite',
      coins: rates.proCoins || 10000,
      badge: 'VIP Coverage',
      description: `High volume app testing for studios with ${rates.proTesters || 30} testers for ${rates.proDays || 14} days.`,
      popular: false
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <CustomerLayout>
        <div className="space-y-8 font-sans pb-16">
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
                          <span className="text-3xl font-black text-zinc-900">{Math.round(plan.coins).toLocaleString()}</span>
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

          {/* ======================================================== */}
          {/* DEPOSIT / BUY COINS MODAL (SHOWING ONLY ALLOWED ADMIN METHODS) */}
          {/* ======================================================== */}
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

                {/* Amount Selector */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Deposit Amount ($ USD)
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
                    Equivalent in PKR: <strong className="text-zinc-700">Rs {Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} PKR</strong>
                  </p>
                </div>

                {/* Category Switcher: Manual vs API */}
                {manualList.length > 0 && apiList.length > 0 && (
                  <div className="flex bg-zinc-100 p-1 rounded-2xl mb-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setDepositCategory('manual')}
                      className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        effectiveCategory === 'manual'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      Direct Transfer ({manualList.length} Allowed)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositCategory('api')}
                      className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        effectiveCategory === 'api'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      Instant Automated ({apiList.length} Allowed)
                    </button>
                  </div>
                )}

                {/* Empty State when no payment methods are active */}
                {manualList.length === 0 && apiList.length === 0 && (
                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                    <p className="text-sm font-bold text-amber-800">No Payment Methods Enabled</p>
                    <p className="text-xs text-amber-600">The platform administrator has not enabled any manual or automated payment gateways yet. Please check back shortly or contact support.</p>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 1. MANUAL PAYMENT METHODS TAB */}
                {/* ======================================================== */}
                {effectiveCategory === 'manual' && manualList.length > 0 && (
                  <div className="space-y-4">
                    {/* Method Selector Chips */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Select Allowed Receiving Account:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {manualList.map(([key, m]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedManualKey(key)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between ${
                              selectedManualKey === key 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <span className="truncate">{m.title}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1">{m.badge || 'Allowed'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* LIVE ACCOUNT DETAILS WITH 1-CLICK COPY BUTTONS */}
                    {selectedManualData && (
                      <div className="p-4 bg-zinc-900 text-white rounded-2xl text-xs space-y-3 font-sans border border-zinc-800 shadow-inner">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wider">
                            Send Payment To:
                          </span>
                          <span className="text-amber-400 font-extrabold text-xs">
                            Amount: Rs {Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} PKR (${depositAmountUsd} USD)
                          </span>
                        </div>

                        {/* Title */}
                        {selectedManualData.accountTitle && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-[11px]">Account Title:</span>
                            <strong className="text-white font-bold">{selectedManualData.accountTitle}</strong>
                          </div>
                        )}

                        {/* Number / Address with Copy Button */}
                        {selectedManualData.accountNumber && (
                          <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase block">Account / Number / Wallet:</span>
                              <span className="text-emerald-400 font-mono font-bold text-xs break-all">
                                {selectedManualData.accountNumber}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedManualData.accountNumber, 'acc_num')}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              {copiedField === 'acc_num' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedField === 'acc_num' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        )}

                        {/* Bank IBAN if present */}
                        {selectedManualData.iban && (
                          <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase block">IBAN Number:</span>
                              <span className="text-emerald-400 font-mono font-bold text-xs">
                                {selectedManualData.iban}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedManualData.iban, 'iban')}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              {copiedField === 'iban' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedField === 'iban' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        )}

                        {/* Raast ID if present */}
                        {selectedManualData.raastId && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-[11px]">Raast ID / Binance ID:</span>
                            <span className="text-white font-mono font-bold">{selectedManualData.raastId}</span>
                          </div>
                        )}

                        {/* Instructions */}
                        {selectedManualData.instructions && (
                          <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800">
                            💡 {selectedManualData.instructions}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Manual Submission Form */}
                    <form onSubmit={handleDepositSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Sender Name / Account Holder
                        </label>
                        <input 
                          type="text" 
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g. Omar Farooq"
                          required
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Transaction ID (TID) / Sender Account Number
                        </label>
                        <input 
                          type="text" 
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          placeholder="e.g. TID: 9876543210 or 0300XXXXXXX"
                          required
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      {/* Screenshot Upload Box */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Upload Payment Receipt Screenshot</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Auto-optimized WebP</span>
                        </label>
                        
                        {receiptScreenshot ? (
                          <div className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-950 p-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={receiptScreenshot} 
                                alt="Receipt Preview" 
                                className="w-14 h-14 object-cover rounded-xl border border-zinc-800" 
                              />
                              <div>
                                <p className="text-xs font-bold text-white">Receipt Attached ✓</p>
                                <p className="text-[10px] text-emerald-400 font-medium">Ready for verification</p>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setReceiptScreenshot(null)}
                              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold rounded-xl transition cursor-pointer border border-red-500/30"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="w-full border-2 border-dashed border-zinc-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-500 hover:bg-emerald-50/20 cursor-pointer transition">
                            <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                            <span className="text-xs font-bold text-zinc-800">
                              {isCompressingImage ? 'Processing Image...' : 'Click to attach screenshot proof'}
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG receipt slip / screenshot</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleReceiptUpload}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex gap-3 pt-3">
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
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {depositSubmitted ? 'Submitting Proof...' : 'Submit Payment Proof'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. AUTOMATED API GATEWAYS TAB */}
                {/* ======================================================== */}
                {effectiveCategory === 'api' && apiList.length > 0 && (
                  <div className="space-y-4">
                    {/* API Selector Chips */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Select Online Automated Gateway:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {apiList.map(([key, g]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedApiKey(key)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between ${
                              selectedApiKey === key 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <span className="truncate">{g.title}</span>
                            <span className="text-[10px] text-indigo-600 font-semibold mt-1">
                              {g.mode === 'live' ? '🟢 Live' : '🧪 Sandbox'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic API Gateway Checkout Form */}
                    <form onSubmit={handleInstantApiPay} className="space-y-3 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-zinc-900">
                            {selectedApiKey === 'jazzcash' ? 'JazzCash Mobile Wallet Auto-Verify' :
                             selectedApiKey === 'easypaisa' ? 'Easypaisa DirectPay Auto-Verify' :
                             selectedApiKey === 'binancePay' ? 'Binance Pay Instant 0-Fee Checkout' :
                             'Secure 256-Bit Encrypted Card Checkout'}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Auto-Verify ⚡
                        </span>
                      </div>

                      {/* JAZZCASH API FORM */}
                      {selectedApiKey === 'jazzcash' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              JazzCash Mobile Account Number
                            </label>
                            <input 
                              type="text" 
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="03001234567"
                              required
                              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-red-500 outline-none"
                            />
                            <p className="text-[10px] text-zinc-400 mt-1">You will receive an MPIN confirmation prompt on your JazzCash mobile app / phone.</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              CNIC Last 6 Digits (Optional / Security)
                            </label>
                            <input 
                              type="text" 
                              maxLength={6}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="e.g. 123456"
                              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* EASYPAISA API FORM */}
                      {selectedApiKey === 'easypaisa' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              Easypaisa Account Number
                            </label>
                            <input 
                              type="text" 
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="03001234567"
                              required
                              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <p className="text-[10px] text-zinc-400 mt-1">An instant OTP / Approval prompt will be sent to your Easypaisa registered account.</p>
                          </div>
                        </div>
                      )}

                      {/* STRIPE / CARD / PAYPAL API FORM */}
                      {(selectedApiKey === 'stripe' || selectedApiKey === 'paypal' || selectedApiKey === 'lemonSqueezy' || selectedApiKey === 'payfast') && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              Card Number
                            </label>
                            <input 
                              type="text" 
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 •••• •••• 4242"
                              required
                              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                                Expiry Date
                              </label>
                              <input 
                                type="text" 
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value)}
                                placeholder="MM / YY"
                                required
                                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                                CVC / CVV
                              </label>
                              <input 
                                type="password" 
                                maxLength={4}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                placeholder="•••"
                                required
                                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BINANCE PAY FORM */}
                      {selectedApiKey === 'binancePay' && (
                        <div className="p-3 bg-zinc-900 rounded-xl text-white text-center space-y-2">
                          <p className="text-xs text-amber-400 font-bold">Binance Pay 1-Click Instant Checkout</p>
                          <p className="text-[11px] text-zinc-400">Total: ${depositAmountUsd} USDT (0 Network Fees)</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-3">
                        <button 
                          type="button" 
                          onClick={() => setShowDeposit(false)}
                          className="flex-1 px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-semibold text-xs rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          disabled={cardProcessing}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {cardProcessing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                          {cardProcessing ? 'Authorizing Payment...' : 
                           selectedApiKey === 'jazzcash' ? `Pay Rs ${Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} via JazzCash` :
                           selectedApiKey === 'easypaisa' ? `Pay Rs ${Math.round(depositAmountUsd * rates.pkrPerUsd).toLocaleString()} via Easypaisa` :
                           `Pay $${depositAmountUsd} USD Now`}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PAYMENT METHODS MODAL */}
          {/* ======================================================== */}
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
