'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Smartphone, 
  Plus, 
  Settings, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Coins, 
  Rocket, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  package: string;
  category: string;
  icon: string;
  status: string;
  testers: string;
  daysRemaining: number;
  budgetCoins: string;
  description: string;
}

export default function CustomerProjects() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);

  // Default app campaigns
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 1, 
      name: 'Fitness Tracker Pro', 
      package: 'com.fitnesstracker.pro', 
      category: 'Health & Fitness',
      icon: '🏋️',
      status: 'Active (14-Day Test)', 
      testers: '20/20 Testers Active',
      daysRemaining: 4,
      budgetCoins: '2,000 Coins',
      description: 'Daily workout planner and heart rate tracking app.'
    },
    { 
      id: 2, 
      name: 'Crypto Wallet Manager', 
      package: 'com.cryptowallet.app', 
      category: 'Finance',
      icon: '🔐',
      status: 'Active (14-Day Test)', 
      testers: '18/20 Testers Active',
      daysRemaining: 11,
      budgetCoins: '2,500 Coins',
      description: 'Multi-chain decentralized cryptocurrency wallet.'
    },
  ]);

  // Real-time Play Store URL / Package Name Parser & Auto-Fill Engine
  const handleUrlChange = (url: string) => {
    setPlayStoreUrl(url);
    if (!url.trim()) {
      setFetchedData(null);
      return;
    }

    // Extract package name from URL like https://play.google.com/store/apps/details?id=com.spotify.music
    let pkg = url.trim();
    if (pkg.includes('id=')) {
      pkg = pkg.split('id=')[1].split('&')[0];
    } else if (pkg.includes('/')) {
      pkg = pkg.split('/').pop() || pkg;
    }

    if (pkg.length > 3) {
      setIsFetching(true);
      setTimeout(() => {
        // Formulate smart readable app name from package
        const nameParts = pkg.replace('com.', '').replace('app.', '').split('.');
        const readableName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

        // Intelligent category & icon matcher
        let cat = 'Tools & Utilities';
        let icon = '📱';
        if (pkg.includes('fit') || pkg.includes('health') || pkg.includes('gym')) {
          cat = 'Health & Fitness';
          icon = '🏋️';
        } else if (pkg.includes('pay') || pkg.includes('bank') || pkg.includes('crypto') || pkg.includes('wallet') || pkg.includes('finance')) {
          cat = 'Finance & Banking';
          icon = '💳';
        } else if (pkg.includes('game') || pkg.includes('play')) {
          cat = 'Games';
          icon = '🎮';
        } else if (pkg.includes('music') || pkg.includes('sound') || pkg.includes('audio')) {
          cat = 'Music & Audio';
          icon = '🎵';
        } else if (pkg.includes('shop') || pkg.includes('store') || pkg.includes('ecommerce')) {
          cat = 'Shopping';
          icon = '🛍️';
        }

        setFetchedData({
          name: readableName || 'My Android Application',
          package: pkg,
          category: cat,
          icon: icon,
          description: `Verified closed test package for ${readableName}. Ready for 20 testers / 14 days test.`,
          testersTarget: 20,
          durationDays: 14,
          requiredCoins: 2000,
        });
        setIsFetching(false);
      }, 400);
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
      status: 'Recruiting 20 Testers',
      testers: '0/20 Testers Joined',
      daysRemaining: 14,
      budgetCoins: `${fetchedData.requiredCoins.toLocaleString()} 🪙`,
      description: fetchedData.description
    };

    setProjects([newProject, ...projects]);
    setShowAddModal(false);
    setPlayStoreUrl('');
    setFetchedData(null);
    alert(`🎉 Campaign for ${newProject.name} launched successfully! 20 certified testers will begin testing your app.`);
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                <Rocket className="w-6 h-6 text-indigo-600" />
                My Apps & Closed Testing Campaigns
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Get 20 verified testers for 14 continuous days to meet Google Play Console requirements.
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Add & Test New App
            </button>
          </div>

          {/* Active Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(proj => (
              <div key={proj.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 hover:shadow-md transition">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                      {proj.icon}
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                      {proj.budgetCoins}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-zinc-900">{proj.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{proj.package}</p>
                  <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>

                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {proj.testers}
                    </span>
                    <span className="text-zinc-500 font-medium">
                      {proj.daysRemaining} days left
                    </span>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center text-xs">
                  <Link href={`/customer/campaigns?project=${proj.id}`} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    Campaign Live Status &rarr;
                  </Link>
                  <span className="text-[11px] text-zinc-400 font-semibold">{proj.category}</span>
                </div>
              </div>
            ))}
            
            {/* Quick Add App Card */}
            <div 
              onClick={() => setShowAddModal(true)}
              className="border-2 border-dashed border-zinc-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-white cursor-pointer transition-all min-h-[260px] group"
            >
              <div className="w-14 h-14 bg-zinc-100 group-hover:bg-indigo-100 text-zinc-400 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition">Register & Test New App</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">Paste your Google Play link to auto-fill details and start testing.</p>
            </div>
          </div>

          {/* Add App & Auto-Fetch Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900">Launch Google Play Closed Test</h3>
                      <p className="text-xs text-zinc-500">Auto-fetches app details from Play Store link</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                {/* URL Input Box */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Google Play Store Link or Package Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={playStoreUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=com.example.app" 
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-4 py-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono"
                      />
                      {isFetching && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Tip: Paste your closed testing link or package name (e.g. <code>com.myfitness.app</code>)
                    </p>
                  </div>

                  {/* Auto-Fetched Live Preview Card */}
                  {fetchedData && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-200/80 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">App Details Auto-Detected</span>
                      </div>

                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {fetchedData.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-zinc-900">{fetchedData.name}</h4>
                          <p className="text-xs text-zinc-500 font-mono">{fetchedData.package}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/80 border border-zinc-200 text-[10px] font-bold text-zinc-600 rounded-full">
                            {fetchedData.category}
                          </span>
                        </div>
                      </div>

                      {/* Campaign Specifications */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-200/60 text-center">
                        <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Testers</p>
                          <p className="text-xs font-black text-zinc-900">20 Certified</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Duration</p>
                          <p className="text-xs font-black text-zinc-900">14 Days</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Cost</p>
                          <p className="text-xs font-black text-amber-600">2,000 🪙</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Testing Instructions Form */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Special Testing Instructions for Testers (Optional)
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder="e.g. Please test the signup screen, create 1 workout plan, and report if app crashes on Android 14."
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
                    🚀 Launch 14-Day Campaign (2,000 🪙)
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
