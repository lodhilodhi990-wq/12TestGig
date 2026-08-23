'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  Rocket, 
  Clock, 
  CheckCircle2, 
  Users, 
  Plus, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Coins,
  Award,
  Sliders
} from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: number;
  name: string;
  package: string;
  icon: string;
  status: 'Active' | 'Completed' | 'Pending' | string;
  testers: string;
  spent: string;
  budget: string;
  daysPassed: number;
  totalDays: number;
  playStoreUrl?: string;
}

export default function CustomerCampaigns() {
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Customizable settings
  const [testerCount, setTesterCount] = useState<number>(20);
  const [durationDays, setDurationDays] = useState<number>(14);
  const [dailyRate, setDailyRate] = useState<number>(100);
  const [selectedPreset, setSelectedPreset] = useState<'playstore' | 'quick' | 'pro' | 'custom'>('playstore');

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_apps_campaigns');
      if (saved) {
        setCampaigns(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCampaigns = (newCamps: Campaign[]) => {
    setCampaigns(newCamps);
    try {
      localStorage.setItem('user_apps_campaigns', JSON.stringify(newCamps));
    } catch (e) {
      console.error(e);
    }
  };

  const calculatedCost = Math.round((testerCount * durationDays * (dailyRate / 14)) + (testerCount * 50));

  const applyPreset = (preset: 'playstore' | 'quick' | 'pro' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'playstore') {
      setTesterCount(20);
      setDurationDays(14);
      setDailyRate(100);
    } else if (preset === 'quick') {
      setTesterCount(10);
      setDurationDays(7);
      setDailyRate(100);
    } else if (preset === 'pro') {
      setTesterCount(30);
      setDurationDays(14);
      setDailyRate(150);
    }
  };

  const handleUrlChange = async (url: string) => {
    setPlayStoreUrl(url);
    if (!url.trim()) {
      setFetchedData(null);
      return;
    }

    let pkg = url.trim();
    if (pkg.includes('id=')) pkg = pkg.split('id=')[1].split('&')[0];
    else if (pkg.includes('/') && !pkg.startsWith('http')) pkg = pkg.split('/').pop() || pkg;

    if (pkg.length >= 3) {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/play-store/metadata?url=${encodeURIComponent(url.trim())}`);
        const data = await res.json();
        if (data.success) {
          setFetchedData({
            name: data.name,
            package: data.packageId,
            icon: data.icon,
            category: data.category || 'Tools',
            playStoreUrl: data.playStoreUrl || url
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    }
  };

  const handleLaunch = () => {
    if (!fetchedData) return;

    const newCamp: Campaign = {
      id: Date.now(),
      name: fetchedData.name,
      package: fetchedData.package,
      icon: fetchedData.icon,
      status: `Active (${durationDays}-Day Track)`,
      testers: `0/${testerCount} Testers Assigned`,
      spent: '0 Coins',
      budget: `${calculatedCost.toLocaleString()} Coins`,
      daysPassed: 1,
      totalDays: durationDays,
      playStoreUrl: fetchedData.playStoreUrl
    };

    const updated = [newCamp, ...campaigns];
    saveCampaigns(updated);
    setShowLaunchModal(false);
    setPlayStoreUrl('');
    setFetchedData(null);
    alert(`🚀 Campaign for "${newCamp.name}" launched! ${testerCount} testers assigned.`);
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <CustomerLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Rocket className="w-6 h-6 text-blue-600" />
                Google Play Closed Testing Campaigns
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Customize tester slots, testing duration, and track daily progress logs.
              </p>
            </div>
            <button 
              onClick={() => setShowLaunchModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Rocket className="w-4 h-4" /> Launch Campaign
            </button>
          </div>

          {/* Clean State: If No Campaigns */}
          {campaigns.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-zinc-900">No Active Campaigns</h2>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm">
                Paste your Google Play closed test link to launch a custom campaign with real certified testers.
              </p>
              <button 
                onClick={() => setShowLaunchModal(true)}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Launch Your First Campaign
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900">Your Active Campaigns</h2>
                <span className="text-xs text-zinc-400 font-medium">Customizable duration & tester capacity</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">App & Package Name</th>
                      <th className="p-4">Spent Coins</th>
                      <th className="p-4">Budget</th>
                      <th className="p-4">Tester Capacity</th>
                      <th className="p-4">Progress Track</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {campaigns.map(camp => (
                      <tr key={camp.id} className="hover:bg-zinc-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                              {camp.icon?.startsWith('http') ? (
                                <img src={camp.icon} alt={camp.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{camp.icon || '📱'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-zinc-900">{camp.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono">{camp.package}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-emerald-600">{camp.spent}</td>
                        <td className="p-4 text-zinc-500 font-medium">{camp.budget}</td>
                        <td className="p-4 font-bold text-zinc-900">{camp.testers}</td>
                        <td className="p-4">
                          <div className="w-32">
                            <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-semibold">
                              <span>Day {camp.daysPassed} / {camp.totalDays}</span>
                              <span>{camp.totalDays - camp.daysPassed}d left</span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${(camp.daysPassed / camp.totalDays) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                            <Clock className="w-3.5 h-3.5" />
                            {camp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setSelectedCampaign(camp)}
                            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl text-xs transition"
                          >
                            View Logs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADVANCED CUSTOM CAMPAIGN BUILDER MODAL */}
          {showLaunchModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-zinc-900">Custom Campaign Builder</h3>
                      <p className="text-xs text-zinc-500">Auto-fetches app logo & allows custom tester configuration</p>
                    </div>
                  </div>
                  <button onClick={() => setShowLaunchModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Google Play Store URL or Package ID
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={playStoreUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=com.spotify.music" 
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono"
                      />
                      {isFetching && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {fetchedData && (
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                          {fetchedData.icon?.startsWith('http') ? (
                            <img src={fetchedData.icon} alt={fetchedData.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900">{fetchedData.name}</h4>
                          <p className="text-xs text-zinc-500 font-mono">{fetchedData.package}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-white text-[10px] font-bold text-indigo-700 rounded-full border border-indigo-100">
                            {fetchedData.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preset Packages */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-600" /> Select Testing Package
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset('playstore')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedPreset === 'playstore' 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600' 
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Google Play Req</span>
                        <p className="font-extrabold text-xs mt-0.5">20 Testers</p>
                        <p className="text-[11px] text-zinc-500 font-medium">14 Days • 2,000 Coins</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyPreset('quick')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedPreset === 'quick' 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600' 
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Quick Audit</span>
                        <p className="font-extrabold text-xs mt-0.5">10 Testers</p>
                        <p className="text-[11px] text-zinc-500 font-medium">7 Days • 800 Coins</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyPreset('pro')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedPreset === 'pro' 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600' 
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Pro Coverage</span>
                        <p className="font-extrabold text-xs mt-0.5">30 Testers</p>
                        <p className="text-[11px] text-zinc-500 font-medium">14 Days • 3,500 Coins</p>
                      </button>
                    </div>
                  </div>

                  {/* Customizable Sliders */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="text-zinc-600">Number of Certified Testers:</span>
                        <span className="text-blue-600 text-sm font-black">{testerCount} Testers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min={5} 
                          max={100} 
                          step={5}
                          value={testerCount}
                          onChange={(e) => { setTesterCount(Number(e.target.value)); setSelectedPreset('custom'); }}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
                        />
                        <input 
                          type="number"
                          min={1}
                          max={500}
                          value={testerCount}
                          onChange={(e) => { setTesterCount(Math.max(1, Number(e.target.value))); setSelectedPreset('custom'); }}
                          className="w-16 px-2 py-1 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-center font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="text-zinc-600">Testing Duration:</span>
                        <span className="text-indigo-600 text-sm font-black">{durationDays} Days</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[7, 14, 21, 30].map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => { setDurationDays(d); setSelectedPreset('custom'); }}
                            className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                              durationDays === d 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow' 
                                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                            }`}
                          >
                            {d} Days
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Campaign Cost</p>
                        <p className="text-xs text-zinc-600">{testerCount} testers × {durationDays} days</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-base font-black text-amber-600">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{calculatedCost.toLocaleString()} Coins</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-bold">≈ ${(calculatedCost / 100).toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLaunchModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLaunch}
                    disabled={!fetchedData}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-40"
                  >
                    Launch Campaign ({calculatedCost.toLocaleString()} Coins)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Detail Modal */}
          {selectedCampaign && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                      {selectedCampaign.icon?.startsWith('http') ? (
                        <img src={selectedCampaign.icon} alt={selectedCampaign.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📱</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-zinc-900">{selectedCampaign.name}</h3>
                      <p className="text-xs text-zinc-500 font-mono">{selectedCampaign.package}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCampaign(null)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Google Play Testing Status:</span>
                    <span className="font-bold text-blue-600">{selectedCampaign.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Active Daily Testers:</span>
                    <span className="font-bold text-zinc-900">{selectedCampaign.testers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Progress:</span>
                    <span className="font-bold text-zinc-900">Day {selectedCampaign.daysPassed} of {selectedCampaign.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Budget:</span>
                    <span className="font-bold text-emerald-600">{selectedCampaign.budget}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Exporting 14-day Play Console testing report for ${selectedCampaign.name}...`)}
                  className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 mb-3"
                >
                  <Download className="w-4 h-4" /> Export Google Play 14-Day Audit PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
