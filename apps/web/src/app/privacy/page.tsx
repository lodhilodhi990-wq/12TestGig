'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Top Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
            <Shield className="w-5 h-5 text-blue-600" />
            12 Test Gig Legal Center
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm space-y-8">
          <div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              GDPR, CCPA & Google AdSense Compliant
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Last Updated: August 2026 • Official Platform Policy
            </p>
          </div>

          <div className="prose prose-zinc max-w-none text-xs leading-relaxed text-zinc-600 space-y-6">
            <p>
              Welcome to <strong>12 Test Gig</strong> ("we," "our," or "the Platform"). We provide a verified closed testing matching network for Android app developers to satisfy Google Play Store's 20-tester requirement. We are deeply committed to protecting your personal information and your right to privacy.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password hash, and user role (Developer, Certified Tester, Affiliate Earner).</li>
              <li><strong>Testing Activity Data:</strong> Daily test milestones, app usage durations, crash telemetry, and submitted verification screenshots.</li>
              <li><strong>Payout & Billing Information:</strong> Payment account identifiers (JazzCash number, Easypaisa title, Bank IBAN, USDT wallet addresses). We do not store raw card numbers.</li>
              <li><strong>Google Play Console Metadata:</strong> Public package names, Google Group opt-in emails, and closed testing track URLs.</li>
            </ul>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Coordinate and verify 20 opted-in testers for 14 continuous days per Google Play Console requirements.</li>
              <li>Process coin purchases, calculate tester rewards, and disburse withdrawal payouts.</li>
              <li>Detect and prevent fraudulent testing submissions through our anti-duplicate hash verification engine.</li>
              <li>Serve personalized or contextual advertisements via Google AdSense where enabled.</li>
            </ul>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              3. Cookies & Google AdSense Advertising
            </h2>
            <p>
              Our website may use third-party advertising cookies, including Google AdSense and DoubleClick cookies, to serve ads based on user visits to this and other internet sites. Users may opt out of personalized advertising by visiting Google's Ads Settings.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              4. Data Retention & Security
            </h2>
            <p>
              All user passwords and sensitive tokens are encrypted using industry-standard protocols. Testing proof images are processed client-side and saved securely in cloud Firestore documents. You may request account deletion at any time by contacting our support desk.
            </p>

            <h2 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-2">
              5. Contact Our Data Protection Officer
            </h2>
            <p>
              For privacy inquiries or data requests, please email us at <strong className="text-zinc-900 font-mono">privacy@12testgig.com</strong> or submit a ticket via our <Link href="/tester/support" className="text-blue-600 font-bold underline">Live Support Desk</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
