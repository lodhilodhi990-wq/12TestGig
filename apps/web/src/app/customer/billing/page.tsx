'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  CreditCard, 
  Download, 
  Coins, 
  Upload, 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Building, 
  Smartphone, 
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'easypaisa' | 'jazzcash' | 'bank' | 'payoneer';
  title: string;
  details: string;
  isDefault: boolean;
}

export default function CustomerBilling() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm_1', type: 'card', title: 'Visa Card', details: 'ending in 4242 (Exp 12/26)', isDefault: true },
    { id: 'pm_2', type: 'easypaisa', title: 'Easypaisa Account', details: '0300-1234567 (Umar H.)', isDefault: false },
  ]);

  const [newMethodType, setNewMethodType] = useState<'card' | 'easypaisa' | 'jazzcash' | 'bank'>('card');
  const [newMethodNumber, setNewMethodNumber] = useState('');
  const [newMethodName, setNewMethodName] = useState('');

  const invoices = [
    { id: 'INV-2023-001', desc: 'Bought 5,000 Coins', date: 'Oct 24, 2023', amount: '$50.00 (5,000 Coins)', status: 'Paid' },
    { id: 'INV-2023-002', desc: 'Bought 10,000 Coins', date: 'Sep 24, 2023', amount: '$100.00 (10,000 Coins)', status: 'Paid' },
    { id: 'INV-2023-003', desc: 'Bought 15,000 Coins', date: 'Aug 24, 2023', amount: '$150.00 (15,000 Coins)', status: 'Paid' },
  ];

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

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <CustomerLayout>
        <div className="space-y-8 font-sans">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
              <Coins className="w-6 h-6 text-amber-500" />
              Billing, Coins & Payment Methods
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-1">Manage your Coin balance, deposits, and payment methods for app testing campaigns.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-zinc-800">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Coins className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase">Available Balance</p>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mt-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white">12,500 <span className="text-xl md:text-2xl font-extrabold text-amber-400">Coins</span></h2>
                  <p className="text-emerald-400 font-bold text-sm border-l border-zinc-700 pl-3">≈ $125.00 USD (PKR 35,000)</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setShowDeposit(true)}
                    className="px-6 py-3 bg-white text-zinc-900 font-black text-xs rounded-xl hover:bg-zinc-100 transition shadow-md"
                  >
                    + Buy More Coins
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

            {/* Payment Methods Side Card */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Saved Payment Methods
                  </h2>
                  <button 
                    onClick={() => { setShowPaymentMethodsModal(true); setShowAddMethodForm(true); }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map(pm => (
                    <div key={pm.id} className="border border-zinc-200 rounded-2xl p-3 flex items-center justify-between bg-zinc-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">
                          {pm.type === 'card' ? '💳' : '📱'}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-900">{pm.title}</p>
                          <p className="text-[11px] text-zinc-500 font-mono">{pm.details}</p>
                        </div>
                      </div>
                      {pm.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
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
                + Add new card / account
              </button>
            </div>
          </div>

          {/* Billing History Table */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-zinc-400" /> Coin Invoices & Billing History
              </h2>
              <button 
                onClick={() => alert('Exporting billing statement as PDF...')}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
            <div className="divide-y divide-zinc-100">
              {invoices.map(inv => (
                <div key={inv.id} className="p-5 flex items-center justify-between hover:bg-zinc-50 transition">
                  <div>
                    <p className="font-bold text-sm text-zinc-900">{inv.desc}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="font-mono">{inv.id}</span>
                      <span>•</span>
                      <span>{inv.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-zinc-900">{inv.amount}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit / Buy Coins Modal */}
          {showDeposit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">Buy Coins (Deposit Funds)</h3>
                    <p className="text-xs text-zinc-500">Exchange Rate: <strong>$1.00 USD = 100 Coins</strong> (≈ PKR 280)</p>
                  </div>
                  <button onClick={() => setShowDeposit(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                    <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 mb-1">
                      <Smartphone className="w-4 h-4 text-emerald-600" /> Easypaisa / JazzCash
                    </p>
                    <p className="text-sm font-mono text-zinc-800 font-bold">0300-1234567</p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Account Title: Umar Hayat</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                    <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 mb-1">
                      <Building className="w-4 h-4 text-blue-600" /> Meezan Bank Transfer (PKR)
                    </p>
                    <p className="text-sm font-mono text-zinc-800 font-bold">Acc: 123456789</p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Title: Umar Hayat (IBAN: PK89MEZN...)</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 md:col-span-2">
                    <p className="text-xs font-bold text-zinc-900 mb-1">Payoneer / Binance USDT</p>
                    <p className="text-sm font-mono text-zinc-800 font-bold">pay@12testgig.com</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Amount Sent (USD or PKR Equivalent)</label>
                    <input type="number" placeholder="e.g. 50 (will credit 5,000 Coins)" className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Upload Receipt / Screenshot</label>
                    <div className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition">
                      <Upload className="w-6 h-6 mb-2 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-700">Click to upload payment receipt screenshot</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeposit(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert('Payment receipt submitted to Admin! Coins will be credited within 10-30 minutes.');
                      setShowDeposit(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
                  >
                    Submit Payment Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Management Modal */}
          {showPaymentMethodsModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-zinc-900">Manage Payment Methods</h3>
                  <button onClick={() => setShowPaymentMethodsModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                {/* Existing methods */}
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="border border-zinc-200 rounded-2xl p-4 flex items-center justify-between bg-zinc-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-zinc-900">{pm.title}</p>
                          {pm.isDefault && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{pm.details}</p>
                      </div>
                      <button 
                        onClick={() => setPaymentMethods(paymentMethods.filter(m => m.id !== pm.id))}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Method Form Toggle */}
                {!showAddMethodForm ? (
                  <button 
                    onClick={() => setShowAddMethodForm(true)}
                    className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 mb-4"
                  >
                    <Plus className="w-4 h-4" /> Add New Payment Method
                  </button>
                ) : (
                  <form onSubmit={handleAddNewMethod} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 mb-4">
                    <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Add New Account / Card</h4>
                    
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Method Type</label>
                      <select 
                        value={newMethodType} 
                        onChange={(e) => setNewMethodType(e.target.value as any)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold"
                      >
                        <option value="card">Credit / Debit Card (Visa / Mastercard)</option>
                        <option value="easypaisa">Easypaisa (Pakistan)</option>
                        <option value="jazzcash">JazzCash (Pakistan)</option>
                        <option value="bank">Bank Account / IBAN</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        {newMethodType === 'card' ? 'Card Number' : 'Mobile / Account Number'}
                      </label>
                      <input 
                        type="text" 
                        value={newMethodNumber}
                        onChange={(e) => setNewMethodNumber(e.target.value)}
                        placeholder={newMethodType === 'card' ? '4242 •••• •••• 4242' : '03001234567'}
                        required
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Holder Name</label>
                      <input 
                        type="text" 
                        value={newMethodName}
                        onChange={(e) => setNewMethodName(e.target.value)}
                        placeholder="e.g. Umar Hayat"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddMethodForm(false)}
                        className="flex-1 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                      >
                        Save Method
                      </button>
                    </div>
                  </form>
                )}

                <button 
                  onClick={() => setShowPaymentMethodsModal(false)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
