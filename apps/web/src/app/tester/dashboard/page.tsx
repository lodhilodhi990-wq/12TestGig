'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Coins, 
  ArrowUpRight, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Users, 
  Smartphone, 
  Copy, 
  Check, 
  Sparkles,
  Upload,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function UnifiedDashboard() {
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  const [activeTestingTasks, setActiveTestingTasks] = useState<any[]>([]);
  const [myAppCampaigns, setMyAppCampaigns] = useState<any[]>([]);
  const [availableAppsToTest, setAvailableAppsToTest] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedCampaigns = localStorage.getItem('user_apps_campaigns');
      if (savedCampaigns) {
        const parsed = JSON.parse(savedCampaigns);
        setMyAppCampaigns(parsed);
        setAvailableAppsToTest(parsed);
      }
      const savedTests = localStorage.getItem('tester_active_tests');
      if (savedTests) {
        setActiveTestingTasks(JSON.parse(savedTests));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText('https://12-test-gig.vercel.app/register?ref=partner-123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = [
    { title: 'Total Coins', value: '15,000 Coins', sub: '≈ $150.00 USD (PKR 42,000)', icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'My Active Tests', value: `${activeTestingTasks.length} Apps`, sub: '14-Day Google Play Tracks', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'My App Campaigns', value: `${myAppCampaigns.length} Apps`, sub: '20 Testers Assigned', icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Referral Earnings', value: '4,500 Coins', sub: '10% Lifetime Bonus', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <ProtectedRoute allowedRoles={['tester', 'customer', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans">
          {/* Welcome & Role Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-zinc-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-4 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                All-in-One: Test Apps, Launch 20-Tester Campaigns & Earn
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Welcome to 12 Test Gig Hub 🚀
                  </h1>
                  <p className="text-blue-100 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
                    Test Google Play apps to earn Coins, use your Coins to get 20 certified testers for your own app, or withdraw real cash directly to Easypaisa, JazzCash, Bank, or Payoneer!
                  </p>
                </div>

                {/* Quick Wallet Summary Pill */}
                <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-start min-w-[240px]">
                  <p className="text-[11px] text-zinc-300 font-semibold tracking-wider uppercase">Available Balance</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-300">15,000 <span className="text-sm font-bold">Coins</span></span>
                  </div>
                  <p className="text-xs text-emerald-300 font-bold mt-0.5">≈ $150.00 USD (PKR 42,000)</p>

                  <div className="flex items-center gap-2 mt-3 w-full">
                    <button 
                      onClick={() => setShowWithdraw(true)}
                      className="flex-1 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-black rounded-xl transition text-center shadow"
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

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action 1: Earn by Testing */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">1. Earn by Testing</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Join 14-day closed testing tracks on Google Play, open daily for 2 minutes & earn coins.
                </p>
              </div>
              <Link 
                href="/tester/tests"
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                Browse Apps to Test <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Action 2: Test My Own App */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">2. Test My Own App</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Paste your Google Play link to auto-fetch real app logo and recruit 20 verified testers for 14 days!
                </p>
              </div>
              <Link 
                href="/customer/projects"
                className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                Add App & Launch <Plus className="w-4 h-4" />
              </Link>
            </div>

            {/* Action 3: Refer & Earn */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">3. Refer & Earn (10%)</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Share your partner link with friends. Earn 10% lifetime bonus on all their testing rewards!
                </p>
              </div>
              <button 
                onClick={copyReferral}
                className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Copy Partner Link'}
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.title} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">{metric.title}</p>
                  <p className="text-2xl font-black text-zinc-900 mt-0.5">{metric.value}</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1 truncate">{metric.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Active Testing Tasks */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">My Active Testing Tasks</h2>
                  <p className="text-xs text-zinc-500">14-Day Play Store check-in tracks</p>
                </div>
                <Link href="/tester/tests" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  View All &rarr;
                </Link>
              </div>

              <div className="p-4 flex-1">
                {activeTestingTasks.length === 0 ? (
                  <div className="text-center p-8 text-zinc-400 text-xs">
                    You haven't joined any testing tasks yet. 
                    <br/>
                    <Link href="/tester/tests" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                      Browse Apps to Test &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTestingTasks.map(test => (
                      <div key={test.id} className="p-3.5 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                            {test.icon?.startsWith('http') ? (
                              <img src={test.icon} alt={test.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">📱</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-zinc-900">{test.name}</p>
                            <p className="text-[11px] text-zinc-500">Day {test.completedDays || 1} of 14</p>
                          </div>
                        </div>
                        <Link 
                          href="/tester/tests" 
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl"
                        >
                          Check-in
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* My App Campaigns */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">My App Campaigns (20 Testers)</h2>
                  <p className="text-xs text-zinc-500">Google Play Closed Testing Status</p>
                </div>
                <Link href="/customer/campaigns" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Manage &rarr;
                </Link>
              </div>

              <div className="p-4 flex-1">
                {myAppCampaigns.length === 0 ? (
                  <div className="text-center p-8 text-zinc-400 text-xs">
                    No app campaigns running right now.
                    <br/>
                    <Link href="/customer/projects" className="text-indigo-600 font-bold hover:underline mt-2 inline-block">
                      + Launch Your App Campaign
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myAppCampaigns.map(camp => (
                      <div key={camp.id} className="p-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                            {camp.icon?.startsWith('http') ? (
                              <img src={camp.icon} alt={camp.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">📱</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-zinc-900">{camp.name}</p>
                            <p className="text-[11px] text-zinc-500">20 Testers Assigned</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                          Active 14-Day Track
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Withdraw Modal */}
          {showWithdraw && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-zinc-900">Withdraw Coins to Cash</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>
                <p className="text-xs text-zinc-500 mb-5">
                  Available Balance: <strong className="text-zinc-900 font-bold">15,000 Coins</strong> (≈ $150.00 USD / ~PKR 42,000).
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
                    <input 
                      type="number" 
                      defaultValue={5000} 
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

          {/* Deposit Modal */}
          {showDeposit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-zinc-900">Buy Coins (Deposit Funds)</h3>
                  <button onClick={() => setShowDeposit(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>
                <p className="text-xs text-zinc-500 mb-5">
                  Deposit funds to buy coins for your app testing campaigns. Rate: <strong>$1.00 USD = 100 Coins</strong>.
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
