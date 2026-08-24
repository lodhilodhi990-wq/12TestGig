'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Rocket, 
  ExternalLink,
  ShieldCheck,
  Clock,
  Trash2,
  Users,
  Coins,
  Sliders,
  Award,
  Zap,
  Info
} from 'lucide-react';
import Link from 'next/link';

import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';

interface Project {
  id: number;
  name: string;
  package: string;
  category: string;
  icon: string;
  status: string;
  testersCount: number;
  durationDays: number;
  dailyReward: number;
  testers: string;
  daysRemaining: number;
  budgetCoins: string;
  description: string;
  playStoreUrl?: string;
}

export default function CustomerProjects() {
  const [rates, setRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [instructions, setInstructions] = useState('');

  // Customizable Campaign Configuration
  const [testerCount, setTesterCount] = useState<number>(20);
  const [durationDays, setDurationDays] = useState<number>(14);
  const [dailyRate, setDailyRate] = useState<number>(100);
  const [selectedPreset, setSelectedPreset] = useState<'playstore' | 'quick' | 'pro' | 'custom'>('playstore');

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsub = subscribeToLivePricingRates((liveRates) => {
      setRates(liveRates);
      if (liveRates.dailyTesterPayout) setDailyRate(liveRates.dailyTesterPayout);
    });

    try {
      const saved = localStorage.getItem('user_apps_campaigns');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('user_apps_campaigns', JSON.stringify(newProjects));
    } catch (e) {
      console.error(e);
    }
  };

  // 100% Accurate Cost Calculation Engine
  const calculateCost = () => {
    if (selectedPreset === 'playstore' && testerCount === (rates.base20Testers || 20) && durationDays === (rates.base20Days || 14)) {
      return rates.base20TesterCost ?? 200;
    }
    if (selectedPreset === 'quick' && testerCount === (rates.quickTesters || 10) && durationDays === (rates.quickDays || 7)) {
      return rates.quickCoins ?? 100;
    }
    if (selectedPreset === 'pro' && testerCount === (rates.proTesters || 30) && durationDays === (rates.proDays || 14)) {
      return rates.proCoins ?? 350;
    }
    const baseCost = rates.base20TesterCost ?? 200;
    const baseTesters = rates.base20Testers ?? 20;
    const baseDays = rates.base20Days ?? 14;
    const costPerTesterDay = baseCost / (baseTesters * baseDays);
    return Math.round(testerCount * durationDays * costPerTesterDay);
  };

  const calculatedCost = calculateCost();

  const applyPreset = (preset: 'playstore' | 'quick' | 'pro' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'playstore') {
      setTesterCount(rates.base20Testers ?? 20);
      setDurationDays(rates.base20Days ?? 14);
    } else if (preset === 'quick') {
      setTesterCount(rates.quickTesters ?? 10);
      setDurationDays(rates.quickDays ?? 7);
    } else if (preset === 'pro') {
      setTesterCount(rates.proTesters ?? 30);
      setDurationDays(rates.proDays ?? 14);
    }
  };

  // Real-Time Play Store Scraper & Real Logo Fetcher
  const handleUrlChange = async (url: string) => {
    setPlayStoreUrl(url);
    if (!url.trim()) {
      setFetchedData(null);
      return;
    }

    let pkg = url.trim();
    if (pkg.includes('id=')) {
      pkg = pkg.split('id=')[1].split('&')[0];
    } else if (pkg.includes('/') && !pkg.startsWith('http')) {
      pkg = pkg.split('/').pop() || pkg;
    }

    if (pkg.length >= 3) {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/play-store/metadata?url=${encodeURIComponent(url.trim())}`);
        const data = await res.json();
        if (data.success) {
          setFetchedData({
            name: data.name,
            package: data.packageId,
            category: data.category || 'Tools & Utilities',
            icon: data.icon,
            description: data.description || `Play Store verified testing build for ${data.name}.`,
            playStoreUrl: data.playStoreUrl || url
          });
        }
      } catch (err) {
        console.error('Failed to fetch play store data', err);
      } finally {
        setIsFetching(false);
      }
    }
  };

  const handleLaunchCampaign = () => {
    if (!fetchedData) return;

    const newProject: Project = {
      id: Date.now(),
      name: fetchedData.name,
      package: fetchedData.package,
      category: fetchedData.category,
      icon: fetchedData.icon,
      status: `Active (${durationDays}-Day Track)`,
      testersCount: testerCount,
      durationDays: durationDays,
      dailyReward: dailyRate,
      testers: `0/${testerCount} Testers Joined`,
      daysRemaining: durationDays,
      budgetCoins: `${calculatedCost.toLocaleString()} Coins`,
      description: instructions || fetchedData.description,
      playStoreUrl: fetchedData.playStoreUrl
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    setShowAddModal(false);
    setPlayStoreUrl('');
    setFetchedData(null);
    setInstructions('');
    alert(`🎉 Campaign for "${newProject.name}" launched! ${testerCount} testers assigned for ${durationDays} days.`);
  };

  const handleDeleteApp = (id: number) => {
    if (confirm('Are you sure you want to remove this app campaign?')) {
      const filtered = projects.filter(p => p.id !== id);
      saveProjects(filtered);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Rocket className="w-6 h-6 text-indigo-600" />
                My Apps & Google Play Closed Testing
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Customize tester count (10, 20, 50+), test duration (7-30 days), and launch closed test campaigns!
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Add & Test New App
            </button>
          </div>

          {/* Clean State: If No Apps Yet */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-zinc-900">No Apps Added Yet</h2>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
                Paste your Google Play Store link (e.g. closed testing track or live app) to auto-fetch the real logo, customize your testers count and launch!
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Paste Play Store Link & Add App
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(proj => (
                <div key={proj.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 hover:shadow-md transition">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* REAL APP LOGO */}
                      <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        {proj.icon?.startsWith('http') ? (
                          <img 
                            src={proj.icon} 
                            alt={proj.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{proj.icon || '📱'}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full">
                          {proj.budgetCoins}
                        </span>
                        <button 
                          onClick={() => handleDeleteApp(proj.id)}
                          className="text-zinc-400 hover:text-red-500 p-1 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-zinc-900 line-clamp-1">{proj.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{proj.package}</p>
                    <p className="text-xs text-zinc-600 mt-2.5 line-clamp-2 leading-relaxed">{proj.description}</p>

                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {proj.testers}
                      </span>
                      <span className="text-zinc-500 font-medium">
                        {proj.daysRemaining} days remaining
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center text-xs">
                    <Link href={`/customer/campaigns?project=${proj.id}`} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      View Campaign Progress &rarr;
                    </Link>
                    <span className="text-[11px] text-zinc-400 font-semibold">{proj.category}</span>
                  </div>
                </div>
              ))}

              {/* Add New Card */}
              <div 
                onClick={() => setShowAddModal(true)}
                className="border-2 border-dashed border-zinc-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-white cursor-pointer transition-all min-h-[260px] group"
              >
                <div className="w-14 h-14 bg-zinc-100 group-hover:bg-indigo-100 text-zinc-400 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition">+ Add Another App</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Paste Play Store link to customize testers & launch.</p>
              </div>
            </div>
          )}

          {/* ADVANCED ADD APP & CAMPAIGN CUSTOMIZER MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900">Custom Campaign Builder</h3>
                      <p className="text-xs text-zinc-500">Auto-fetches app logo & allows customizable tester packages</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="space-y-5 mb-6">
                  {/* URL Input Box */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Paste Google Play Store Link or Package Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={playStoreUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=com.whatsapp" 
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono"
                      />
                      {isFetching && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Auto-Fetched Real Logo Preview */}
                  {fetchedData && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                          {fetchedData.icon?.startsWith('http') ? (
                            <img src={fetchedData.icon} alt={fetchedData.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{fetchedData.icon || '📱'}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-sm text-zinc-900 truncate">{fetchedData.name}</h4>
                          <p className="text-xs text-zinc-500 font-mono truncate">{fetchedData.package}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/90 border border-zinc-200 text-[10px] font-bold text-zinc-600 rounded-full">
                            {fetchedData.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESET PACKAGES SELECTOR */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-600" /> Select Testing Package
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* 1. Google Play Requirement */}
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
                        <p className="font-extrabold text-xs mt-0.5">{rates.base20Testers || 20} Testers</p>
                        <p className="text-[11px] text-zinc-500 font-medium">{rates.base20Days || 14} Days • {(rates.base20TesterCost ?? 200).toLocaleString()} Coins</p>
                      </button>

                      {/* 2. Quick Audit (Hide if disabled in SaaS panel) */}
                      {(rates.quickEnabled !== false) && (
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
                          <p className="font-extrabold text-xs mt-0.5">{rates.quickTesters || 10} Testers</p>
                          <p className="text-[11px] text-zinc-500 font-medium">{rates.quickDays || 7} Days • {(rates.quickCoins ?? 100).toLocaleString()} Coins</p>
                        </button>
                      )}

                      {/* 3. Pro Coverage (Hide if disabled in SaaS panel) */}
                      {(rates.proEnabled !== false) && (
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
                          <p className="font-extrabold text-xs mt-0.5">{rates.proTesters || 30} Testers</p>
                          <p className="text-[11px] text-zinc-500 font-medium">{rates.proDays || 14} Days • {(rates.proCoins ?? 350).toLocaleString()} Coins</p>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CUSTOMIZABLE SLIDERS & CONTROLS */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-zinc-600" /> Fine-Tune Campaign Settings
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedPreset('custom')}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Custom Mode
                      </button>
                    </div>

                    {/* 1. Testers Count Slider & Input */}
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
                      <p className="text-[10px] text-zinc-400 mt-1">Google Play Console closed testing requires at least 20 testers.</p>
                    </div>

                    {/* 2. Duration Selector */}
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

                    {/* 3. Dynamic Calculation Summary Bar */}
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
                        <p className="text-[10px] text-emerald-600 font-bold">
                          ≈ ${(calculatedCost / (rates.coinsPerUsd || 100)).toFixed(2)} USD (Rs {Math.round((calculatedCost / (rates.coinsPerUsd || 100)) * (rates.pkrPerUsd || 280)).toLocaleString()} PKR)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Special Testing Instructions (Optional)
                    </label>
                    <textarea 
                      rows={2} 
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Please test user login, browse catalog, test checkout, and verify no crashes on Android 14."
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLaunchCampaign}
                    disabled={!fetchedData}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-40"
                  >
                    🚀 Launch Campaign ({calculatedCost.toLocaleString()} Coins)
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
