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
  Sliders,
  AlertTriangle,
  CreditCard,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import TelemetryAuditModal from '@/components/TelemetryAuditModal';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  where 
} from 'firebase/firestore';

import { subscribeToLivePricingRates, DEFAULT_PRICING_RATES, PricingRates } from '@/lib/pricingRates';

interface Campaign {
  id: string | number;
  name: string;
  package: string;
  icon: string;
  status: 'Active' | 'Completed' | 'Pending' | string;
  testers: string;
  spent: string;
  budget: string;
  costNumber: number;
  daysPassed: number;
  totalDays: number;
  playStoreUrl?: string;
}

export default function CustomerCampaigns() {
  const { user, firebaseUser } = useAuth();
  const userId = firebaseUser?.uid || user?.id;

  const [rates, setRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [auditModalCamp, setAuditModalCamp] = useState<Campaign | null>(null);

  // User Live Coin Balance
  const [userCoinsBalance, setUserCoinsBalance] = useState<number>(0);
  const [insufficientFundsError, setInsufficientFundsError] = useState<string | null>(null);
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);

  // Customizable settings
  const [testerCount, setTesterCount] = useState<number>(20);
  const [durationDays, setDurationDays] = useState<number>(14);
  const [selectedPreset, setSelectedPreset] = useState<'playstore' | 'quick' | 'pro' | 'custom'>('playstore');

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const unsub = subscribeToLivePricingRates((liveRates) => {
      setRates(liveRates);
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Listen to user's coins balance
  useEffect(() => {
    if (!userId) return;

    try {
      const unsubUser = onSnapshot(doc(db, 'users', userId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const bal = data.coinsBalance !== undefined ? Number(data.coinsBalance) :
                      data.coins !== undefined ? Number(data.coins) : 0;
          setUserCoinsBalance(bal);
        }
      });

      return () => unsubUser();
    } catch (err) {
      console.warn('Campaigns page balance listener error:', err);
    }
  }, [userId]);

  // Load user campaigns from Firestore + local cache
  useEffect(() => {
    if (!userId) {
      try {
        const saved = localStorage.getItem('user_apps_campaigns');
        if (saved) setCampaigns(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      const q = query(collection(db, 'campaigns'), where('developerId', '==', userId));
      const unsubCamps = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: Campaign[] = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              name: data.appName || data.name || 'Android App',
              package: data.packageId || data.package || '',
              icon: data.icon || '📱',
              status: data.playStoreStatus || data.status || 'Active',
              testers: `${data.activeTesters || 0}/${data.targetTesters || 20} Testers Assigned`,
              spent: '0 Coins',
              budget: `${(data.costCoins || data.budgetCoins || 2000).toLocaleString()} Coins`,
              costNumber: data.costCoins || 2000,
              daysPassed: data.daysPassed || 1,
              totalDays: data.totalDays || 14,
              playStoreUrl: data.playStoreUrl || ''
            };
          });
          setCampaigns(list);
          localStorage.setItem('user_apps_campaigns', JSON.stringify(list));
        } else {
          const saved = localStorage.getItem('user_apps_campaigns');
          if (saved) setCampaigns(JSON.parse(saved));
        }
      }, (err) => {
        console.warn('Campaigns listener notice', err);
      });

      return () => unsubCamps();
    } catch (err) {
      console.warn('Campaigns query error:', err);
    }
  }, [userId]);

  const saveCampaignsLocally = (newCamps: Campaign[]) => {
    setCampaigns(newCamps);
    try {
      localStorage.setItem('user_apps_campaigns', JSON.stringify(newCamps));
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

  const handleUrlChange = async (url: string) => {
    setPlayStoreUrl(url);
    setInsufficientFundsError(null);
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

  const handleLaunch = async () => {
    if (!fetchedData) return;
    setInsufficientFundsError(null);

    // 1. STRICT BALANCE VALIDATION
    if (userCoinsBalance < calculatedCost) {
      const shortage = calculatedCost - userCoinsBalance;
      setInsufficientFundsError(
        `⚠️ Insufficient Coin Balance! You have ${userCoinsBalance.toLocaleString()} Coins, but this testing campaign requires ${calculatedCost.toLocaleString()} Coins (Short by ${shortage.toLocaleString()} Coins). Please buy coins to launch.`
      );
      return;
    }

    setIsSubmittingCampaign(true);

    try {
      const newCampaignId = `CMP-${Date.now()}`;
      const newBal = userCoinsBalance - calculatedCost;

      // 2. DEDUCT COINS IN FIRESTORE USER DOC
      if (userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          coinsBalance: newBal,
          coins: newBal,
          updatedAt: new Date().toISOString()
        });

        // 3. WRITE TO FIRESTORE CAMPAIGNS COLLECTION
        const campaignRef = doc(db, 'campaigns', newCampaignId);
        await setDoc(campaignRef, {
          id: newCampaignId,
          developerId: userId,
          developerEmail: firebaseUser?.email || user?.email || 'developer@example.com',
          developerName: firebaseUser?.displayName || (user as any)?.displayName || (user as any)?.name || 'Developer',
          appName: fetchedData.name,
          packageId: fetchedData.package,
          category: fetchedData.category,
          icon: fetchedData.icon || '📱',
          costCoins: calculatedCost,
          budgetCoins: `${calculatedCost.toLocaleString()} 🪙`,
          targetTesters: testerCount,
          activeTesters: 0,
          totalDays: durationDays,
          daysPassed: 0,
          playStoreStatus: 'Testing in Progress',
          playStoreUrl: fetchedData.playStoreUrl,
          createdAt: serverTimestamp(),
          updatedAt: new Date().toISOString()
        });
      }

      const newCamp: Campaign = {
        id: newCampaignId,
        name: fetchedData.name,
        package: fetchedData.package,
        icon: fetchedData.icon,
        status: `Active (${durationDays}-Day Track)`,
        testers: `0/${testerCount} Testers Assigned`,
        spent: '0 Coins',
        budget: `${calculatedCost.toLocaleString()} Coins`,
        costNumber: calculatedCost,
        daysPassed: 1,
        totalDays: durationDays,
        playStoreUrl: fetchedData.playStoreUrl
      };

      const updated = [newCamp, ...campaigns];
      saveCampaignsLocally(updated);
      setUserCoinsBalance(newBal);
      localStorage.setItem('user_coins_balance', String(newBal));

      setShowLaunchModal(false);
      setPlayStoreUrl('');
      setFetchedData(null);
      alert(`🎉 Campaign for "${newCamp.name}" launched successfully!\n\n💰 ${calculatedCost.toLocaleString()} Coins deducted.`);
    } catch (err) {
      console.error('Campaign launch error:', err);
      alert('Could not complete campaign launch.');
    } finally {
      setIsSubmittingCampaign(false);
    }
  };

  const isAffordable = userCoinsBalance >= calculatedCost;

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
            
            <div className="flex items-center gap-3">
              <Link 
                href="/customer/billing"
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Coins className="w-4 h-4 text-amber-600" /> {userCoinsBalance.toLocaleString()} Coins
              </Link>
              <button 
                onClick={() => {
                  setShowLaunchModal(true);
                  setInsufficientFundsError(null);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Rocket className="w-4 h-4" /> Launch Campaign
              </button>
            </div>
          </div>

          {/* Clean State: If No Campaigns */}
          {campaigns.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-zinc-900">No Active Campaigns</h2>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
                Launch a 14-day closed testing campaign to meet Google Play Console requirement of 20 testers.
              </p>
              <button 
                onClick={() => {
                  setShowLaunchModal(true);
                  setInsufficientFundsError(null);
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Launch New 14-Day Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map(camp => (
                <div key={camp.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                        {camp.icon?.startsWith('http') ? (
                          <img src={camp.icon} alt={camp.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-zinc-900 line-clamp-1">{camp.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{camp.package}</p>

                    <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">14-Day Progress:</span>
                        <span className="font-bold text-zinc-900">Day {camp.daysPassed} of {camp.totalDays}</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (camp.daysPassed / camp.totalDays) * 100)}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-[11px] pt-1">
                        <span className="text-zinc-500">{camp.testers}</span>
                        <span className="font-bold text-emerald-600">{camp.budget}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <button 
                      onClick={() => setAuditModalCamp(camp)}
                      className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Play Console Answers & Audit
                    </button>
                    <button 
                      onClick={() => setSelectedCampaign(camp)}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Audit Details &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TELEMETRY PRODUCTION AUDIT MODAL */}
          {auditModalCamp && (
            <TelemetryAuditModal
              isOpen={!!auditModalCamp}
              onClose={() => setAuditModalCamp(null)}
              campaign={{
                id: String(auditModalCamp.id),
                title: auditModalCamp.name,
                packageName: auditModalCamp.package,
                testersCount: 20,
                daysCount: auditModalCamp.totalDays || 14,
                status: auditModalCamp.status
              }}
            />
          )}

          {/* LAUNCH CAMPAIGN MODAL WITH COIN VALIDATION */}
          {showLaunchModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900">Custom Campaign Builder</h3>
                      <p className="text-xs text-zinc-500">Auto-fetches app logo & verifies coin balance</p>
                    </div>
                  </div>
                  <button onClick={() => setShowLaunchModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold cursor-pointer">✕</button>
                </div>

                {/* USER COIN BALANCE NOTIFICATION BADGE */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  isAffordable 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold">Your Wallet Balance:</span>
                    <strong className="font-mono font-black text-sm">{userCoinsBalance.toLocaleString()} Coins</strong>
                  </div>
                  {!isAffordable && (
                    <Link 
                      href="/customer/billing" 
                      target="_blank"
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow"
                    >
                      <CreditCard className="w-3 h-3" /> Buy Coins
                    </Link>
                  )}
                </div>

                {/* INSUFFICIENT FUNDS ERROR BANNER */}
                {insufficientFundsError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p>{insufficientFundsError}</p>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <Link 
                        href="/customer/billing"
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center gap-1.5"
                      >
                        <Coins className="w-3.5 h-3.5" /> Deposit Funds / Buy Coins Now &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Paste Google Play Store Link or Package Name
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
                  </div>

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
                      <button
                        type="button"
                        onClick={() => applyPreset('playstore')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPreset === 'playstore' 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600' 
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Google Play Req</span>
                        <p className="font-extrabold text-xs mt-0.5">{rates.base20Testers || 20} Testers</p>
                        <p className="text-[11px] text-zinc-500 font-medium">{rates.base20Days || 14} Days • {(rates.base20TesterCost ?? 200).toLocaleString()} Coins</p>
                      </button>

                      {(rates.quickEnabled !== false) && (
                        <button
                          type="button"
                          onClick={() => applyPreset('quick')}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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

                      {(rates.proEnabled !== false) && (
                        <button
                          type="button"
                          onClick={() => applyPreset('pro')}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Custom Mode
                      </button>
                    </div>

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
                          onChange={(e) => { setTesterCount(Number(e.target.value)); setSelectedPreset('custom'); setInsufficientFundsError(null); }}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
                        />
                        <input 
                          type="number"
                          min={1}
                          max={500}
                          value={testerCount}
                          onChange={(e) => { setTesterCount(Math.max(1, Number(e.target.value))); setSelectedPreset('custom'); setInsufficientFundsError(null); }}
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
                            onClick={() => { setDurationDays(d); setSelectedPreset('custom'); setInsufficientFundsError(null); }}
                            className={`py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
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
                        <div className={`flex items-center gap-1 text-base font-black ${isAffordable ? 'text-amber-600' : 'text-red-600'}`}>
                          <Coins className="w-4 h-4" />
                          <span>{calculatedCost.toLocaleString()} Coins</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          ≈ ${(calculatedCost / (rates.coinsPerUsd || 100)).toFixed(2)} USD (Rs {Math.round((calculatedCost / (rates.coinsPerUsd || 100)) * (rates.pkrPerUsd || 280)).toLocaleString()} PKR)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowLaunchModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  {isAffordable ? (
                    <button 
                      onClick={handleLaunch}
                      disabled={!fetchedData || isSubmittingCampaign}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmittingCampaign ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Deducting Coins & Launching...</span>
                        </>
                      ) : (
                        `Launch Campaign (${calculatedCost.toLocaleString()} Coins)`
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/customer/billing"
                      target="_blank"
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 text-center"
                    >
                      <CreditCard className="w-4 h-4" /> Deposit Coins to Launch
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Campaign Detail Modal */}
          {selectedCampaign && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
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
                  <button onClick={() => setSelectedCampaign(null)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold cursor-pointer">✕</button>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
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
                  className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
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
