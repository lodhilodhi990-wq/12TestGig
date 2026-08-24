'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import AdvancedLinkGenerator from '@/components/AdvancedLinkGenerator';
import { 
  UserPlus, 
  Mail, 
  Search, 
  Users, 
  Coins, 
  Copy, 
  Check, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPartnerStats, generateDefaultReferralCode, buildReferralUrl, ReferredUser } from '@/lib/referralService';
import Link from 'next/link';

export default function EarnerNetwork() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recruits, setRecruits] = useState<ReferredUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [referralCode, setReferralCode] = useState<string>('PARTNER');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const code = generateDefaultReferralCode(user);
      setReferralCode(code);
      const res = await getPartnerStats(user);
      setRecruits(res.recruits);
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

  // Filter recruits
  const filteredRecruits = recruits.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.campaign && r.campaign.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'active') return r.completedTests > 0;
    if (statusFilter === 'pending') return r.completedTests === 0;
    return true;
  });

  const totalRecruits = recruits.length;
  const activeTesters = recruits.filter(r => r.completedTests > 0).length;
  const totalCommission = recruits.reduce((acc, r) => acc + (r.totalCommissionGenerated || 0), 0);
  const totalTestsCompleted = recruits.reduce((acc, r) => acc + (r.completedTests || 0), 0);

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <EarnerLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Users className="w-7 h-7 text-blue-600" />
                My Tester Network
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Realtime directory of testers recruited under your unique referral code.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> + Invite Tester
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Recruits</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">{totalRecruits}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Registered Testers</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Testers</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{activeTesters}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Tested & Verified Apps</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tasks Completed</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{totalTestsCompleted}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">14-Day App Runs</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Commission</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{totalCommission.toLocaleString()} <span className="text-xs font-bold">Coins</span></p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">≈ ${(totalCommission / 100).toFixed(2)} USD</p>
            </div>
          </div>

          {/* Quick Generator Box on Top of Network Page */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-zinc-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-blue-100 mb-2 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Lifetime 10% - 20% Commission
              </div>
              <h2 className="text-xl font-black">Want to recruit more testers?</h2>
              <p className="text-xs text-blue-100 mt-1 max-w-xl">
                Open your unique link generator to generate custom WhatsApp links, QR codes, or copy pre-written high-converting posts.
              </p>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-3 bg-white hover:bg-zinc-100 active:scale-95 text-zinc-900 font-black text-xs rounded-2xl transition shadow-xl shrink-0 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Open Link & QR Generator</span>
            </button>
          </div>

          {/* Table Container & Filter Bar */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search recruit by name, email or campaign..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    statusFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  All ({recruits.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    statusFilter === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Active ({activeTesters})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    statusFilter === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Pending ({totalRecruits - activeTesters})
                </button>
              </div>
            </div>

            {/* Recruits Table */}
            {filteredRecruits.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-xs">
                <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7" />
                </div>
                <p className="font-bold text-zinc-800 text-sm">
                  {recruits.length === 0 ? 'Your Network is Ready to Grow!' : 'No matching testers found'}
                </p>
                <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
                  {recruits.length === 0 
                    ? 'Share your unique partner link with tester groups on WhatsApp, Telegram, or Facebook to recruit verified testers.'
                    : 'Try changing your search keywords or filter settings.'}
                </p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow"
                >
                  <UserPlus className="w-4 h-4" /> Open Link & QR Generator
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50/80 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Recruit Info</th>
                      <th className="px-6 py-4">Campaign / Channel</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Tests Completed</th>
                      <th className="px-6 py-4">Commission Generated</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredRecruits.map((person) => (
                      <tr key={person.id} className="hover:bg-zinc-50/80 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {person.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-zinc-900">{person.name}</div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {person.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-200">
                            {person.campaign || 'Direct'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 font-medium">{person.joinedAt}</td>
                        <td className="px-6 py-4 font-bold text-zinc-900">
                          {person.completedTests} Apps
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-emerald-600">
                            +{person.totalCommissionGenerated} Coins
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            person.status === 'Active Tester' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {person.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Full Advanced Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 rounded-3xl max-w-2xl w-full border border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8">
                {/* Close Button */}
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-2 sm:p-4">
                  <AdvancedLinkGenerator
                    user={user}
                    referralCode={referralCode}
                    onCodeUpdated={(newCode) => {
                      setReferralCode(newCode);
                      loadData();
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
