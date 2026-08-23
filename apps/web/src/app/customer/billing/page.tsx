'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { CreditCard, Download, ExternalLink, ShieldCheck, Coins } from 'lucide-react';

export default function CustomerBilling() {
  const invoices = [
    { id: 'INV-2023-001', date: 'Oct 24, 2023', amount: '$50.00 (5,000 🪙)', status: 'Paid' },
    { id: 'INV-2023-002', date: 'Sep 24, 2023', amount: '$100.00 (10,000 🪙)', status: 'Paid' },
    { id: 'INV-2023-003', date: 'Aug 24, 2023', amount: '$150.00 (15,000 🪙)', status: 'Paid' },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Billing & Coins</h1>
            <p className="text-zinc-500 mt-1">Manage your Coin balance to fund your testing campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-zinc-950 text-white rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Coins className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-400 font-medium">Available Coins</p>
                <div className="flex items-end gap-3 mt-2">
                  <h2 className="text-5xl font-bold">12,500 🪙</h2>
                  <p className="text-emerald-400 font-medium mb-1 border-l border-zinc-700 pl-3">≈ $125.00 USD</p>
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
                    Buy More Coins
                  </button>
                  <button className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                    Payment Methods
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-zinc-400" /> Payment Methods
              </h2>
              <div className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center font-bold text-indigo-700 italic text-sm">
                    Stripe
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Visa ending in 4242</p>
                    <p className="text-xs text-zinc-500">Expires 12/24</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Default</span>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:underline mt-4">Add new card</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-zinc-400" /> Billing History
              </h2>
              <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
            <div className="divide-y divide-zinc-100">
              {invoices.map(inv => (
                <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div>
                    <p className="font-bold text-zinc-900">{inv.desc}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-zinc-500">{inv.id}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-zinc-500">{inv.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-900">{inv.amount}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
