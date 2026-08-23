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
  AlertCircle,
  Image as ImageIcon,
  Clock,
  Trash2,
  Play
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
  playStoreUrl?: string;
}

export default function CustomerProjects() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [instructions, setInstructions] = useState('');

  // Start with clean dynamic state (persisted in localStorage if available)
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_apps_campaigns');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('user_apps_campaigns', JSON.stringify(newProjects));
    } catch (e) {
      console.error(e);
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
            testersTarget: 20,
            durationDays: 14,
            requiredCoins: 2000,
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
      status: 'Recruiting 20 Testers (Day 1/14)',
      testers: '0/20 Testers Active',
      daysRemaining: 14,
      budgetCoins: `${fetchedData.requiredCoins.toLocaleString()} Coins`,
      description: instructions || fetchedData.description,
      playStoreUrl: fetchedData.playStoreUrl
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    setShowAddModal(false);
    setPlayStoreUrl('');
    setFetchedData(null);
    setInstructions('');
    alert(`🎉 Campaign for "${newProject.name}" launched with real Google Play logo! 20 certified testers will begin testing.`);
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
                Paste your Google Play Store URL &rarr; our system automatically fetches your real app logo, details & assigns 20 testers for 14 days!
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
                Paste your Google Play Store link (e.g. closed testing track or live app) to auto-fetch the real logo and launch your 20-tester campaign!
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
                        {proj.icon.startsWith('http') ? (
                          <img 
                            src={proj.icon} 
                            alt={proj.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{proj.icon}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full">
                          {proj.budgetCoins}
                        </span>
                        <button 
                          onClick={() => handleDeleteApp(proj.id)}
                          className="text-zinc-400 hover:text-red-500 p-1 rounded-lg"
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
                      View 14-Day Progress &rarr;
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
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Paste Play Store link to auto-fetch real icon and details.</p>
              </div>
            </div>
          )}

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
                      <h3 className="text-lg font-black text-zinc-900">Add App & Auto-Fetch Real Logo</h3>
                      <p className="text-xs text-zinc-500">Google Play Store Real-Time Metadata Fetcher</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Paste Google Play Store URL or Package Name
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
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Paste any Google Play link (e.g. <code>https://play.google.com/store/apps/details?id=com.spotify.music</code>)
                    </p>
                  </div>

                  {/* Auto-Fetched REAL LOGO Preview */}
                  {fetchedData && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">Real Play Store Logo & Info Detected</span>
                      </div>

                      <div className="flex items-start gap-3.5 mb-3">
                        {/* REAL LOGO */}
                        <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                          {fetchedData.icon?.startsWith('http') ? (
                            <img 
                              src={fetchedData.icon} 
                              alt={fetchedData.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-3xl">{fetchedData.icon}</span>
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

                      <p className="text-xs text-zinc-600 line-clamp-2 mt-2 bg-white/60 p-2.5 rounded-xl border border-indigo-100/60">
                        {fetchedData.description}
                      </p>

                      {/* Campaign Specifications */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-200/60 text-center">
                        <div className="bg-white/90 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Testers</p>
                          <p className="text-xs font-black text-zinc-900">20 Verified</p>
                        </div>
                        <div className="bg-white/90 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Duration</p>
                          <p className="text-xs font-black text-zinc-900">14 Days</p>
                        </div>
                        <div className="bg-white/90 p-2 rounded-xl border border-indigo-100">
                          <p className="text-[10px] text-zinc-500 font-medium">Required Coins</p>
                          <p className="text-xs font-black text-amber-600">2,000 Coins</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Testing Instructions Form */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Instructions for Testers (Optional)
                    </label>
                    <textarea 
                      rows={2} 
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Please test user login, browse products, and verify no crash on Android 14."
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
                    🚀 Launch Campaign (2,000 Coins)
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
