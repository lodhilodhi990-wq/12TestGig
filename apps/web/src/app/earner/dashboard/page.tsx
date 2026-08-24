'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import AdvancedLinkGenerator from '@/components/AdvancedLinkGenerator';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Activity, 
  Coins, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Calculator, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { 
  getPartnerStats, 
  generateDefaultReferralCode, 
  PartnerStats, 
  ReferredUser, 
  CommissionActivity, 
  REFERRAL_TIERS 
} from '@/lib/referralService';
import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';

export default function EarnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('PARTNER');
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [recruits, setRecruits] = useState<ReferredUser[]>([]);
  const [recentActivity, setRecentActivity] = useState<CommissionActivity[]>([]);
  const [pricingRates, setPricingRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);

  // Simulator Sliders State
  const [simTesters, setSimTesters] = useState<number>(10);
  const [simAppsPerMonth, setSimAppsPerMonth] = useState<number>(4);

  useEffect(() => {
    const unsubPricing = subscribeToLivePricingRates((rates) => {
      setPricingRates(rates);
    });

    return () => unsubPricing();
  }, []);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const code = generateDefaultReferralCode(user);
      setReferralCode(code);

      const res = await getPartnerStats(user);
      setStats(res.stats);
      setRecruits(res.recruits);
      setRecentActivity(res.recentActivity);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Simulator calculations
  const simCoinRewardPerApp = 200; // avg coins per completed 14-day app track
  const currentCommissionPercent = stats?.currentTier?.commissionRate || 10;
  const simMonthlyCommissionCoins = Math.round(
    simTesters * simAppsPerMonth * simCoinRewardPerApp * (currentCommissionPercent / 100)
  );
  const simMonthlyUsd = (simMonthlyCommissionCoins / (pricingRates.coinsPerUsd || 100)).toFixed(2);
  const simMonthlyPkr = Math.round(Number(simMonthlyUsd) * (pricingRates.pkrPerUsd || 280)).toLocaleString();

  const metrics = [
    { 
      label: 'Total Commission Earned', 
      amount: (stats?.totalCommissionEarned || 0).toLocaleString(), 
      unit: 'Coins', 
      icon: Coins, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50', 
      sub: `≈ $${((stats?.totalCommissionEarned || 0) / (pricingRates.coinsPerUsd || 100)).toFixed(2)} USD (PKR ${Math.round(((stats?.totalCommissionEarned || 0) / (pricingRates.coinsPerUsd || 100)) * (pricingRates.pkrPerUsd || 280)).toLocaleString()})` 
    },
    { 
      label: 'Active Network Testers', 
      amount: (stats?.activeRecruits || 0).toString(), 
      unit: 'Recruits', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      sub: `${stats?.totalRecruits || 0} Total Signups` 
    },
    { 
      label: 'Partner Tier Rate', 
      amount: `${stats?.currentTier?.commissionRate || 10}%`, 
      unit: 'Bonus', 
      icon: Award, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      sub: stats?.currentTier?.name || 'Bronze Partner' 
    },
    { 
      label: 'Conversion Rate', 
      amount: `${stats?.conversionRate || 0}%`, 
      unit: '', 
      icon: Activity, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      sub: 'Testers completing tracks' 
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <EarnerLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Users className="w-7 h-7 text-blue-600" />
                Affiliate & Partner Commission Hub
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Recruit testers to Google Play 14-day closed testing tracks and earn up to <strong>20% lifetime commission</strong> on all their rewards!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/earner/network" 
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                View Network ({stats?.totalRecruits || 0})
              </Link>
              <Link 
                href="/tester/wallet" 
                className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                Withdraw Commission <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Real Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">{metric.label}</p>
                  <p className="text-2xl font-black text-zinc-900 mt-0.5">
                    {metric.amount} {metric.unit && <span className="text-xs font-bold text-amber-500">{metric.unit}</span>}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1 truncate">{metric.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Dynamic Link & Campaign Generator */}
          <AdvancedLinkGenerator
            user={user}
            referralCode={referralCode}
            onCodeUpdated={(newCode) => {
              setReferralCode(newCode);
              loadData();
            }}
          />

          {/* Tier Progression & Status Bar */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-extrabold text-zinc-900">Partner Tier Level</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${stats?.currentTier?.badgeBg} ${stats?.currentTier?.badgeColor}`}>
                    {stats?.currentTier?.name || 'Bronze Partner'} ({stats?.currentTier?.commissionRate || 10}%)
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {stats?.nextTier 
                    ? `Recruit ${stats.recruitsNeededForNextTier} more active tester${stats.recruitsNeededForNextTier > 1 ? 's' : ''} to unlock ${stats.nextTier.name} (${stats.nextTier.commissionRate}% Commission)!`
                    : '🎉 You have unlocked the highest Diamond Ambassador VIP Tier!'}
                </p>
              </div>

              {stats?.nextTier && (
                <div className="text-right">
                  <span className="text-xs font-bold text-zinc-500">Tier Progress:</span>
                  <span className="text-sm font-black text-indigo-600 ml-1.5">{stats.progressToNextTier}%</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {stats?.nextTier && (
              <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, stats.progressToNextTier)}%` }}
                />
              </div>
            )}

            {/* Tier Levels Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-4 border-t border-zinc-100">
              {REFERRAL_TIERS.map((tier) => {
                const isCurrent = stats?.currentTier?.id === tier.id;
                return (
                  <div 
                    key={tier.id} 
                    className={`p-3 rounded-2xl border transition ${
                      isCurrent 
                        ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20' 
                        : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-xs text-zinc-900">{tier.name}</p>
                      <span className="text-xs font-black text-amber-500">{tier.commissionRate}%</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      {tier.minActiveRecruits === 0 ? '0+ Recruits' : `${tier.minActiveRecruits}+ Active Recruits`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commission Simulator & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box 1: Interactive Commission Calculator */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-extrabold text-zinc-900">Passive Income Simulator</h2>
                </div>
                <p className="text-xs text-zinc-500">
                  Estimate how much monthly passive income you can generate by sharing your link.
                </p>

                {/* Sliders */}
                <div className="space-y-5 mt-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700 mb-2">
                      <span>Referred Active Testers:</span>
                      <span className="text-blue-600 font-extrabold text-sm">{simTesters} Testers</span>
                    </div>
                    <input 
                      type="range" 
                      min={1} 
                      max={100} 
                      value={simTesters} 
                      onChange={(e) => setSimTesters(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700 mb-2">
                      <span>Average Apps Tested / Month (per tester):</span>
                      <span className="text-indigo-600 font-extrabold text-sm">{simAppsPerMonth} Apps</span>
                    </div>
                    <input 
                      type="range" 
                      min={1} 
                      max={12} 
                      value={simAppsPerMonth} 
                      onChange={(e) => setSimAppsPerMonth(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Projected Result Callout */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Estimated Monthly Commission:</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-emerald-700">{simMonthlyCommissionCoins.toLocaleString()}</span>
                    <span className="text-xs font-bold text-amber-500">Coins / month</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs font-extrabold text-zinc-800">
                    <span>≈ ${simMonthlyUsd} USD</span>
                    <span className="text-zinc-300">|</span>
                    <span className="text-emerald-700">≈ PKR {simMonthlyPkr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Commission Rate: {currentCommissionPercent}% Lifetime</span>
                <span>Instant Withdraw to Easypaisa/JazzCash</span>
              </div>
            </div>

            {/* Box 2: Real Commission Activity */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Recent Commission Activity</h2>
                  <p className="text-xs text-zinc-500">Live rewards from your recruit network</p>
                </div>
                <Link href="/earner/network" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Network Details &rarr;
                </Link>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-center">
                {recentActivity.length === 0 ? (
                  <div className="text-center p-8 text-zinc-400 text-xs">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-zinc-700 text-sm">No Commission Activity Yet</p>
                    <p className="text-zinc-400 text-xs mt-1 max-w-xs mx-auto">
                      Share your unique link on WhatsApp, Telegram, or social media to recruit your first testers and start receiving automated coins!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 space-y-1">
                    {recentActivity.map((act) => (
                      <div key={act.id} className="p-3.5 rounded-2xl hover:bg-zinc-50 transition flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-zinc-900">{act.action}</p>
                          <p className="text-[11px] text-zinc-500">{act.user} • {act.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xs text-emerald-600">
                            +{act.bonusCoins} Coins
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {act.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
