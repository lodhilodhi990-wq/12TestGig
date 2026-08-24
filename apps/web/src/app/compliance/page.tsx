'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Google Play Testing Compliance
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm space-y-8">
          <div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
              100% Policy Compliant
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Google Play 20-Tester Closed Testing Compliance Guide
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              How 12 Test Gig ensures 100% legitimate testing in accordance with Google Play Developer Policies.
            </p>
          </div>

          <div className="prose prose-zinc max-w-none text-xs leading-relaxed text-zinc-600 space-y-6">
            <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl">
              <h3 className="text-xs font-black text-emerald-900 flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Google Play 14-Day Closed Testing Rule (November 2023 Update)
              </h3>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Google mandates that all personal developer accounts created after November 13, 2023 must run a closed test with at least <strong>20 opted-in testers for at least 14 continuous days</strong> before applying for production track access.
              </p>
            </div>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              How 12 Test Gig Guarantees 100% Legitimate Testing
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Real Humans on Real Physical Devices:</strong> Every tester in our network undergoes human identity and hardware validation. We strictly forbid emulator farms.</li>
              <li><strong>Continuous 14-Day Engagement:</strong> Testers do not merely download and delete. They perform structured daily tasks (e.g. Day 1: Opt-in, Day 5: UI interaction, Day 10: Bug feedback, Day 14: Play Store review).</li>
              <li><strong>Valuable Feedback for Developers:</strong> Developers receive genuine telemetry, crash logs, and UX reviews to answer Google's 20-question production evaluation successfully.</li>
            </ul>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              Developer Best Practices to Avoid Rejections
            </h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Do not push breaking release updates in the middle of Day 13 or 14 that could crash the closed testing build.</li>
              <li>Ensure your Privacy Policy URL on Google Play Console is live and accessible.</li>
              <li>Carefully answer the 3 questions Google asks when requesting production access based on the feedback gathered on 12 Test Gig.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
