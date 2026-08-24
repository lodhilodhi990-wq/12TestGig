'use client';
import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
            <FileText className="w-5 h-5 text-blue-600" />
            Terms of Service
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm space-y-8">
          <div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
              Legal Agreement
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Effective Date: August 2026 • Please read carefully before using 12 Test Gig.
            </p>
          </div>

          <div className="prose prose-zinc max-w-none text-xs leading-relaxed text-zinc-600 space-y-6">
            <p>
              By accessing or creating an account on <strong>12 Test Gig</strong> ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              1. Services for App Developers (Customers)
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Developers purchase platform Coins to launch 14-day closed testing campaigns matching 20 certified Android testers.</li>
              <li>Campaign coins are placed into an Escrow Smart-Lock and distributed to testers progressively as verified daily milestones are passed.</li>
              <li>Developers must provide valid Google Play closed testing opt-in links and keep the testing track active for 14 continuous days.</li>
            </ul>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              2. Terms for Certified Testers & Earners
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Testers must use real physical Android devices running supported OS versions. The use of emulators, bot scripts, or fake location spoofing is strictly prohibited.</li>
              <li>Testers must test the assigned app daily and upload genuine, non-duplicate screenshot proof. Submitting duplicate or altered images results in instant account termination and forfeiture of coin balance.</li>
              <li>Withdrawal payouts are disbursed upon reaching the minimum coin threshold and passing automated anti-scam review.</li>
            </ul>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              3. Coin Economics & Anti-Fraud Protection
            </h2>
            <p>
              Coins purchased on the platform are non-transferable outside the official escrow framework. Any user attempting chargebacks or unauthorized transactions will have their IP and accounts permanently blacklisted.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              4. Limitation of Liability
            </h2>
            <p>
              While 12 Test Gig guarantees that 20 real testers will install and test your application for 14 continuous days, ultimate Google Play production track approval remains subject to Google's proprietary policy and content guidelines.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
