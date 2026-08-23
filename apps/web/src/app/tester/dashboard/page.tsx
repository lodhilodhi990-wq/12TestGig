'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Coins, 
  ArrowUpRight, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Plus, 
  Users, 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function UnifiedDashboard() {
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  const copyReferral = () => {
    navigator.clipboard.writeText('https://12testgig.vercel.app/invite/partner-123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = [
    { title: 'Total Coins', value: '15,000 🪙', sub: '≈ $150.00 USD (PKR 42,000)', icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'My Active Tests', value: '2 Apps', sub: 'Earn up to 3,500 🪙', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'My App Campaigns', value: '1 Live', sub: '20/20 Testers Assigned', icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Referral Earnings', value: '4,500 🪙', sub: '12 Active Testers', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const activeTestingTasks = [
    { id: 1, name: 'Fitness Tracker Pro', daysLeft: 4, dayNumber: 10, totalDays: 14, reward: '1,500 🪙', status: 'Today Pending' },
    { id: 2, name: 'Language Learner AI', daysLeft: 12, dayNumber: 2, totalDays: 14, reward: '2,000 🪙', status: 'Checked In' },
  ];

  const myAppCampaigns = [
    { id: 101, name: 'Crypto Wallet Manager', package: 'com.cryptowallet.app', testersCount: '20/20', daysLeft: 6, status: 'In Progress (14-Day Test)', coinsSpent: '2,000 🪙' },
  ];

  const availableAppsToTest = [
    { id: 3, name: 'Meditate Daily - Mindfulness', category: 'Health & Fitness', reward: '1,200 🪙', slots: 3, size: '24 MB' },
    { id: 4, name: 'QuickExpense - Budget Tracker', category: 'Finance', reward: '1,800 🪙', slots: 8, size: '18 MB' },
    { id: 5, name: 'HabitHero - Daily Planner', category: 'Productivity', reward: '1,500 🪙', slots: 5, size: '15 MB' },
  ];

  return (
    <ProtectedRoute allowedRoles={['tester', 'customer', 'earner']}>
      <UserLayout>
        <div className="space-y-8">
          {/* Welcome & Unified Role Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-zinc-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Coins className="w-80 h-80" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-4 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                All-in-One Account: Test, Publish & Earn
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Welcome to 12 Test Gig Hub 🚀
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base mt-1.5 max-w-2xl">
                    Test apps to earn Coins, use your Coins to get 20 closed testers for your own Google Play app, or withdraw real cash directly to Easypaisa, JazzCash, Bank, or Payoneer!
                  </p>
                </div>

                {/* Quick Wallet Summary Pill */}
                <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-start min-w-[240px]">
                  <p className="text-xs text-zinc-300 font-medium">Available Balance</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-300">15,000 🪙</span>
                  </div>
                  <p className="text-xs text-emerald-300 font-semibold mt-0.5">≈ $150.00 USD (PKR 42,000)</p>

                  <div className="flex items-center gap-2 mt-3 w-full">
                    <button 
                      onClick={() => setShowWithdraw(true)}
                      className="flex-1 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-xl transition text-center shadow"
                    >
                      Withdraw
                    </button>
                    <button 
                      onClick={() => setShowDeposit(true)}
                      className="flex-1 px-3 py-1.5 bg-blue-500/80 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition text-center border border-white/20"
                    >
                      + Buy Coins
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Matrix: 3 Core Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action 1: Earn by Testing */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">1. Earn by Testing</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Install apps, test daily for 14 days, submit feedback, and earn 1,000–2,500 🪙 per app.
                </p>
              </div>
              <Link 
                href="/tester/tests"
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                Explore Apps to Test <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Action 2: Test My Own App */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">2. Test My Own App</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Need 20 testers for 14 days to publish on Google Play? Use your earned coins or buy coins to launch a campaign!
                </p>
              </div>
              <Link 
                href="/customer/projects"
                className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                Launch App Test <Plus className="w-4 h-4" />
              </Link>
            </div>

            {/* Action 3: Refer & Earn */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">3. Refer & Earn</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Share your link with friends. Earn a lifetime 10% commission on every test they complete!
                </p>
              </div>
              <button 
                onClick={copyReferral}
                className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Copy Referral Link'}
              </button>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.title} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Live</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">{metric.title}</p>
                  <p className="text-2xl font-black text-zinc-900 mt-0.5">{metric.value}</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1 truncate">{metric.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dual Operations Grid: Tester Center vs App Publisher Center */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section 1: Tester Center (My Active Tests) */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    🎮
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">My Active Testing Tasks</h2>
                    <p className="text-xs text-zinc-500">14-Day Google Play testing check-ins</p>
                  </div>
                </div>
                <Link href="/tester/tests" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-100 p-2 flex-1">
                {activeTestingTasks.map((test) => (
                  <div key={test.id} className="p-4 rounded-2xl hover:bg-zinc-50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">{test.name}</h4>
                        <p className="text-xs text-zinc-500">Day {test.dayNumber} of {test.totalDays} • {test.daysLeft} days remaining</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-600 text-sm">+{test.reward}</span>
                        <p className="text-[10px] text-zinc-400">On completion</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden my-2.5">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(test.dayNumber / test.totalDays) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        test.status === 'Today Pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {test.status === 'Today Pending' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {test.status}
                      </span>

                      <Link 
                        href="/tester/tests" 
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Submit Today's Feedback &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                <Link href="/tester/tests" className="text-xs font-bold text-zinc-700 hover:text-blue-600">
                  + Find More Apps to Test & Earn Coins
                </Link>
              </div>
            </div>

            {/* Section 2: Creator Center (My App Campaigns) */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    📱
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">My App Campaigns (20 Testers)</h2>
                    <p className="text-xs text-zinc-500">Google Play Closed Testing Status</p>
                  </div>
                </div>
                <Link href="/customer/campaigns" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 flex-1 space-y-4">
                {myAppCampaigns.map((camp) => (
                  <div key={camp.id} className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">{camp.name}</h4>
                        <p className="text-xs text-zinc-500 font-mono">{camp.package}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                        {camp.testersCount} Active Testers
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
                      <span>Status: <strong className="text-zinc-900">{camp.status}</strong></span>
                      <span>Budget: <strong className="text-indigo-600">{camp.coinsSpent}</strong></span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-indigo-100 flex justify-between items-center">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" /> {camp.daysLeft} days to Google Play ready
                      </span>
                      <Link href="/customer/analytics" className="text-xs font-bold text-indigo-600 hover:underline">
                        View Tester Logs &rarr;
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Quick Add App Card */}
                <Link 
                  href="/customer/projects"
                  className="block p-5 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-center transition cursor-pointer"
                >
                  <Rocket className="w-6 h-6 text-indigo-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-zinc-900">Have a new app to test?</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Use your 15,000 🪙 balance to recruit 20 verified testers.</p>
                </Link>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                <Link href="/customer/billing" className="text-xs font-bold text-zinc-700 hover:text-indigo-600">
                  🪙 Need more coins? Buy Coins via Easypaisa/JazzCash/Bank
                </Link>
              </div>
            </div>
          </div>

          {/* Available Apps to Test Marketplace Showcase */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Explore New Apps (Earn Coins)</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Test these apps for 14 days and earn coins directly to your wallet</p>
              </div>
              <Link href="/tester/tests" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Browse All Apps <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100">
              {availableAppsToTest.map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl shadow-sm">
                      📱
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{app.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-[11px]">{app.category}</span>
                        <span>•</span>
                        <span>{app.size}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-semibold">{app.slots} tester slots left</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-emerald-600">{app.reward}</p>
                      <p className="text-[10px] text-zinc-400">Total Reward</p>
                    </div>

                    <Link 
                      href="/tester/tests"
                      className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      Start Test & Earn
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Modal: Withdraw (Easypaisa, JazzCash, Payoneer, Bank) */}
          {showWithdraw && (
            <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-zinc-900">Withdraw Coins to Cash</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>
                <p className="text-xs text-zinc-500 mb-5">
                  Available Balance: <strong className="text-zinc-900 font-bold">15,000 🪙</strong> (≈ $150.00 USD / ~42,000 PKR).
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Withdrawal Method</label>
                    <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="easypaisa">Easypaisa (Pakistan)</option>
                      <option value="jazzcash">JazzCash (Pakistan)</option>
                      <option value="bank">Bank Transfer / IBAN (PKR)</option>
                      <option value="payoneer">Payoneer (USD)</option>
                      <option value="binance">Binance Pay / USDT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Account / Mobile Number / Email</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 03001234567 or Payoneer Email" 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Coins to Withdraw</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">🪙</span>
                      <input 
                        type="number" 
                        defaultValue={5000} 
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-emerald-600 font-bold mt-2 text-right">You will receive approx: $50.00 USD (PKR 14,000)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowWithdraw(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert('Withdrawal request submitted! Payout will be processed within 24-48 hours.');
                      setShowWithdraw(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    Confirm Payout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unified Modal: Deposit / Buy Coins */}
          {showDeposit && (
            <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-zinc-900">Buy Coins (Deposit Funds)</h3>
                  <button onClick={() => setShowDeposit(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>
                <p className="text-xs text-zinc-500 mb-5">
                  Deposit funds to buy coins for your app testing campaigns. Rate: <strong>$1.00 USD = 100 🪙</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                    <p className="text-xs font-bold text-zinc-900">Easypaisa / JazzCash</p>
                    <p className="text-xs text-zinc-600 font-mono mt-1">0300-1234567</p>
                    <p className="text-[11px] text-zinc-400 font-medium">Title: Umar Hayat</p>
                  </div>
                  <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                    <p className="text-xs font-bold text-zinc-900">Local Bank Transfer</p>
                    <p className="text-xs text-zinc-600 font-mono mt-1">Meezan Bank: 123456789</p>
                    <p className="text-[11px] text-zinc-400 font-medium">Title: Umar Hayat</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Amount Sent ($ or PKR equivalent)</label>
                    <input type="number" placeholder="e.g. 50" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Upload Receipt / Screenshot</label>
                    <div className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-5 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition">
                      <Upload className="w-6 h-6 mb-1 text-zinc-400" />
                      <span className="text-xs font-semibold">Click to upload payment screenshot</span>
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
                      alert('Payment receipt submitted! Coins will be credited to your account after verification.');
                      setShowDeposit(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    Submit Proof
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
