'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { 
  Users, 
  Activity, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Coins, 
  ArrowUpRight, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function EarnerDashboard() {
  const [copied, setCopied] = useState(false);
  const inviteUrl = 'https://12-test-gig.vercel.app/register?ref=partner-123';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const metrics = [
    { label: 'Total Commission', amount: '45,000', unit: 'Coins', icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50', trend: '≈ $450.00 USD (PKR 126,000)' },
    { label: 'Active Testers', amount: '124', unit: 'Recruits', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12 this week' },
    { label: 'Pending Payout', amount: '5,000', unit: 'Coins', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '≈ $50.00 USD' },
    { label: 'Conversion Rate', amount: '24.5%', unit: '', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.1% higher than avg' },
  ];

  const recentActivity = [
    { id: 1, action: 'New Tester Registered', user: 'Zubair Ahmed', time: '2 hours ago', bonus: '+150 Coins', status: 'Credited' },
    { id: 2, action: 'Test Completed (Fitness App)', user: 'Sarah K.', time: '5 hours ago', bonus: '+250 Coins', status: 'Credited' },
    { id: 3, action: 'Commission Payout to Easypaisa', user: 'You', time: 'Yesterday', bonus: '-10,000 Coins', status: 'Completed' },
    { id: 4, action: 'Test Completed (Crypto Wallet)', user: 'Usman Ali', time: '2 days ago', bonus: '+300 Coins', status: 'Credited' },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <EarnerLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Users className="w-6 h-6 text-blue-600" />
                Affiliate & Partner Commission Hub
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Earn 10% lifetime commission on every app testing task completed by your referred network.
              </p>
            </div>

            <Link 
              href="/tester/wallet" 
              className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              Withdraw Commission <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">{metric.label}</p>
                  <p className="text-2xl font-black text-zinc-900 mt-0.5">
                    {metric.amount} <span className="text-xs font-bold text-amber-500">{metric.unit}</span>
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5">{metric.trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Link & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box 1: Invite Link Box */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-blue-100 mb-4 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Lifetime 10% Bonus
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">Your Unique Partner Link</h2>
                <p className="text-xs text-blue-100 mt-2 leading-relaxed max-w-md">
                  Share this link on WhatsApp groups, Telegram, or social media. Anyone who signs up under your link becomes your tester and earns you coins on every test!
                </p>

                {/* Input & Copy Box */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-xs text-white font-mono truncate select-all">
                    {inviteUrl}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-lg shrink-0 ${
                      copied 
                        ? 'bg-emerald-400 text-zinc-900' 
                        : 'bg-white hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4 text-zinc-900" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                {/* WhatsApp Direct Share Button */}
                <div className="mt-4 flex gap-3">
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Earn money by testing Android apps on 12 Test Gig! Join here: ' + inviteUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition shadow"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Box 2: Recent Referral Activity */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900">Recent Commission Activity</h2>
                <Link href="/earner/network" className="text-xs font-bold text-blue-600 hover:underline">
                  View Full Network &rarr;
                </Link>
              </div>

              <div className="divide-y divide-zinc-100 p-2 flex-1">
                {recentActivity.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-2xl hover:bg-zinc-50 transition flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-zinc-900">{act.action}</p>
                      <p className="text-[11px] text-zinc-500">{act.user} • {act.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-xs ${act.bonus.startsWith('+') ? 'text-emerald-600' : 'text-zinc-900'}`}>
                        {act.bonus}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
