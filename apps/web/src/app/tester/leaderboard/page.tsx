'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Star, 
  Flame, 
  Award, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Smartphone,
  Crown,
  Medal,
  ChevronRight
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  device: string;
  streak: number;
  testsCompleted: number;
  coinsEarned: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  badge: string;
}

const TOP_TESTERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Hamza Khan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    device: 'Samsung Galaxy S24 Ultra (Android 14)',
    streak: 42,
    testsCompleted: 38,
    coinsEarned: 28400,
    tier: 'Diamond',
    badge: '🏆 #1 Top Tester of Month'
  },
  {
    rank: 2,
    name: 'Ayesha Malik',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    device: 'Xiaomi 13 Pro (Android 14)',
    streak: 38,
    testsCompleted: 34,
    coinsEarned: 24600,
    tier: 'Diamond',
    badge: '🥈 Top Bug Hunter'
  },
  {
    rank: 3,
    name: 'Bilal Ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    device: 'Google Pixel 8 (Android 15 Beta)',
    streak: 35,
    testsCompleted: 29,
    coinsEarned: 21900,
    tier: 'Platinum',
    badge: '🥉 100% Streak Master'
  },
  {
    rank: 4,
    name: 'Zainab Fatima',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    device: 'OnePlus 11 (Android 14)',
    streak: 28,
    testsCompleted: 25,
    coinsEarned: 18200,
    tier: 'Platinum',
    badge: '⭐ VIP Quality Reviewer'
  },
  {
    rank: 5,
    name: 'Usman Tariq',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    device: 'Realme GT 5 (Android 13)',
    streak: 26,
    testsCompleted: 22,
    coinsEarned: 16500,
    tier: 'Gold',
    badge: '⚡ Fast Responder'
  },
  {
    rank: 6,
    name: 'Mariam Siddiqui',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    device: 'Oppo Reno 10 (Android 13)',
    streak: 22,
    testsCompleted: 19,
    coinsEarned: 14100,
    tier: 'Gold',
    badge: '🎯 Daily Explorer'
  },
  {
    rank: 7,
    name: 'Danish Ali',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    device: 'Vivo V29 5G (Android 14)',
    streak: 19,
    testsCompleted: 16,
    coinsEarned: 12400,
    tier: 'Gold',
    badge: '📱 UX Specialist'
  },
  {
    rank: 8,
    name: 'Sana Javed',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    device: 'Infinix Note 30 (Android 13)',
    streak: 16,
    testsCompleted: 14,
    coinsEarned: 10800,
    tier: 'Silver',
    badge: '🚀 Active Tester'
  }
];

export default function TesterLeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'monthly' | 'streak'>('monthly');

  return (
    <ProtectedRoute allowedRoles={['tester', 'customer', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans max-w-6xl pb-16">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                Monthly Hall of Fame & Badges
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Top Certified Android Testers Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Earn daily check-in coins, maintain consecutive 14-day test streaks, and unlock VIP reputation badges. Top 3 testers receive monthly cash prize pool bonuses!
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold">
                  <Trophy className="w-3.5 h-3.5" /> 1st Prize: +5,000 Coins
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold">
                  <Medal className="w-3.5 h-3.5" /> 2nd Prize: +3,000 Coins
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-600 font-bold">
                  <Medal className="w-3.5 h-3.5" /> 3rd Prize: +1,500 Coins
                </div>
              </div>
            </div>
          </div>

          {/* TOP 3 PODIUM CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rank 2 (Left) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center relative order-2 md:order-1 shadow-xl">
              <div className="absolute -top-3 px-3 py-0.5 bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                🥈 2nd Place
              </div>
              <div className="space-y-3 pt-2">
                <img src={TOP_TESTERS[1].avatar} alt={TOP_TESTERS[1].name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 mx-auto shadow-md" />
                <div>
                  <h3 className="font-black text-white text-base">{TOP_TESTERS[1].name}</h3>
                  <p className="text-[11px] text-blue-400">{TOP_TESTERS[1].badge}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 font-mono text-xs">
                  <p className="text-amber-400 font-black text-lg">{TOP_TESTERS[1].coinsEarned.toLocaleString()} Coins</p>
                  <p className="text-slate-400 text-[10px]">{TOP_TESTERS[1].testsCompleted} Tests • {TOP_TESTERS[1].streak} Days Streak</p>
                </div>
              </div>
            </div>

            {/* Rank 1 (Center, Elevated) */}
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-8 flex flex-col justify-between items-center text-center relative order-1 md:order-2 shadow-2xl shadow-amber-500/10 ring-2 ring-amber-500/20">
              <div className="absolute -top-4 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-slate-950" /> #1 Champion
              </div>
              <div className="space-y-3 pt-2">
                <div className="relative inline-block">
                  <img src={TOP_TESTERS[0].avatar} alt={TOP_TESTERS[0].name} className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 mx-auto shadow-xl" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">👑</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">{TOP_TESTERS[0].name}</h3>
                  <p className="text-xs font-bold text-amber-400">{TOP_TESTERS[0].badge}</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-1 font-mono text-xs">
                  <p className="text-amber-400 font-black text-2xl">{TOP_TESTERS[0].coinsEarned.toLocaleString()} Coins</p>
                  <p className="text-emerald-400 text-[11px] font-bold">Rs {(TOP_TESTERS[0].coinsEarned * 2.8).toLocaleString()} PKR Payouts</p>
                  <p className="text-slate-400 text-[10px] pt-1">{TOP_TESTERS[0].testsCompleted} Closed Tests Completed</p>
                </div>
              </div>
            </div>

            {/* Rank 3 (Right) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center relative order-3 md:order-3 shadow-xl">
              <div className="absolute -top-3 px-3 py-0.5 bg-amber-800 text-amber-100 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                🥉 3rd Place
              </div>
              <div className="space-y-3 pt-2">
                <img src={TOP_TESTERS[2].avatar} alt={TOP_TESTERS[2].name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 mx-auto shadow-md" />
                <div>
                  <h3 className="font-black text-white text-base">{TOP_TESTERS[2].name}</h3>
                  <p className="text-[11px] text-blue-400">{TOP_TESTERS[2].badge}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 font-mono text-xs">
                  <p className="text-amber-400 font-black text-lg">{TOP_TESTERS[2].coinsEarned.toLocaleString()} Coins</p>
                  <p className="text-slate-400 text-[10px]">{TOP_TESTERS[2].testsCompleted} Tests • {TOP_TESTERS[2].streak} Days Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* FULL LEADERBOARD TABLE */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Monthly Rankings & Device Tiers
              </h3>
              <Link 
                href="/tester/tests"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                Join Tests to Climb Rank <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Rank</th>
                    <th className="py-3.5 px-4">Certified Tester</th>
                    <th className="py-3.5 px-4">Physical Device</th>
                    <th className="py-3.5 px-4">14-Day Streak</th>
                    <th className="py-3.5 px-4">Tests Passed</th>
                    <th className="py-3.5 px-5 text-right">Total Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {TOP_TESTERS.map((tester) => (
                    <tr key={tester.rank} className="hover:bg-slate-900/60 transition">
                      <td className="py-4 px-5">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                          tester.rank === 1 ? 'bg-amber-500 text-slate-950' :
                          tester.rank === 2 ? 'bg-slate-700 text-white' :
                          tester.rank === 3 ? 'bg-amber-800 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {tester.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={tester.avatar} alt={tester.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                          <div>
                            <p className="font-bold text-white">{tester.name}</p>
                            <p className="text-[10px] text-blue-400 font-semibold">{tester.badge}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[200px] text-[11px]">{tester.device}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{tester.streak} Days</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-slate-300 font-bold">
                          {tester.testsCompleted} Apps
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right font-mono">
                        <span className="text-amber-400 font-black text-sm">
                          {tester.coinsEarned.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          ≈ Rs {(tester.coinsEarned * 2.8).toLocaleString()} PKR
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
