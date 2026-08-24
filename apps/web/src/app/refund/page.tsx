'use client';
import React from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Refund & Cancellation Policy
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm space-y-8">
          <div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              Escrow Protection
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Refund & Escrow Guarantee Policy
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Our 100% Satisfaction & 14-Day Delivery Commitment
            </p>
          </div>

          <div className="prose prose-zinc max-w-none text-xs leading-relaxed text-zinc-600 space-y-6">
            <p>
              At <strong>12 Test Gig</strong>, developer satisfaction and tester fairness are our highest priorities. We operate on a transparent smart escrow model where your investment is protected until your testing milestones are achieved.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              1. Unused Coin Balance Refunds
            </h2>
            <p>
              If you have purchased coins and have not launched a testing campaign, you may request a refund to your original payment method within 7 days of purchase by submitting a ticket to our Live Support Desk.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              2. Campaign Replacement & Guarantee
            </h2>
            <p>
              If any assigned tester uninstalls your app before completing their 14 continuous days, our automated matching engine will immediately assign a replacement tester at <strong>zero extra coin cost</strong> to you, ensuring your 20-tester requirement remains unbroken.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              3. Processing Timelines
            </h2>
            <p>
              Approved refunds are credited back to your original payment method (JazzCash, Easypaisa, Bank Account, or USDT) within 1 to 3 business days.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
