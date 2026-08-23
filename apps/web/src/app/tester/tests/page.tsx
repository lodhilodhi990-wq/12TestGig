'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Smartphone, 
  ExternalLink, 
  Upload, 
  ChevronRight, 
  Info,
  Sparkles,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface TestItem {
  id: number;
  name: string;
  packageId: string;
  category: string;
  icon: string;
  apkSize: string;
  totalReward: string;
  dailyReward: string;
  completionBonus: string;
  completedDays: number;
  totalDays: number;
  status: 'In Progress' | 'Action Needed' | 'Completed';
  playStoreUrl: string;
  instructions: string;
}

export default function MyTests() {
  const [activeTab, setActiveTab] = useState<'my_tests' | 'explore'>('my_tests');
  const [selectedTask, setSelectedTask] = useState<TestItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const [activeTests, setActiveTests] = useState<TestItem[]>([]);
  const [exploreApps, setExploreApps] = useState<TestItem[]>([]);

  useEffect(() => {
    // Load published campaigns from localStorage or explore marketplace
    try {
      const savedCampaigns = localStorage.getItem('user_apps_campaigns');
      if (savedCampaigns) {
        const parsed = JSON.parse(savedCampaigns);
        const marketplace: TestItem[] = parsed.map((c: any) => ({
          id: c.id,
          name: c.name,
          packageId: c.package,
          category: c.category || 'Android App',
          icon: c.icon,
          apkSize: '24 MB',
          totalReward: '2,000 Coins',
          dailyReward: '100 Coins/day',
          completionBonus: '600 Coins',
          completedDays: 0,
          totalDays: 14,
          status: 'In Progress',
          playStoreUrl: c.playStoreUrl || `https://play.google.com/store/apps/details?id=${c.package}`,
          instructions: c.description || 'Open app daily for 2 minutes and submit feedback on day 7 & 14.'
        }));
        setExploreApps(marketplace);
      } else {
        setExploreApps([]);
      }

      const savedTests = localStorage.getItem('tester_active_tests');
      if (savedTests) {
        setActiveTests(JSON.parse(savedTests));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveActiveTests = (tests: TestItem[]) => {
    setActiveTests(tests);
    try {
      localStorage.setItem('tester_active_tests', JSON.stringify(tests));
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinTest = (app: TestItem) => {
    const updated = [app, ...activeTests];
    saveActiveTests(updated);
    setActiveTab('my_tests');
    alert(`🎉 You joined the 14-day test team for "${app.name}"! Complete daily tasks to earn coins.`);
  };

  const handleClaimToday = (test: TestItem) => {
    setSelectedTask(test);
    setShowFeedbackModal(true);
  };

  const submitDailyLog = () => {
    if (!selectedTask) return;
    const updated = activeTests.map(t => 
      t.id === selectedTask.id 
        ? { ...t, completedDays: Math.min(t.totalDays, t.completedDays + 1), status: 'In Progress' as const } 
        : t
    );
    saveActiveTests(updated);
    setShowFeedbackModal(false);
    setFeedbackText('');
    alert(`🎉 Day ${selectedTask.completedDays + 1} check-in verified! +${selectedTask.dailyReward} added to your wallet.`);
  };

  return (
    <ProtectedRoute allowedRoles={['tester', 'customer', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <Smartphone className="w-6 h-6 text-blue-600" />
                Testing Assignments & Google Play Opt-Ins
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Participate in 14-day closed test tracks, open apps daily for 2 minutes, and earn coins.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center p-1 bg-zinc-200/80 rounded-2xl">
              <button 
                onClick={() => setActiveTab('my_tests')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'my_tests' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                My Active Tests ({activeTests.length})
              </button>
              <button 
                onClick={() => setActiveTab('explore')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'explore' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Explore New Apps ({exploreApps.length})
              </button>
            </div>
          </div>

          {/* TAB 1: MY ACTIVE TESTS */}
          {activeTab === 'my_tests' ? (
            activeTests.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-black text-zinc-900">No Active Tests Joined Yet</h2>
                <p className="text-xs text-zinc-500 mt-1.5 max-w-sm">
                  Browse available Google Play apps in the marketplace and join a 14-day testing campaign to earn coins daily!
                </p>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  Explore Available Apps &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTests.map(test => (
                  <div key={test.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 md:p-8 hover:border-blue-300 transition">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* App Identity & REAL LOGO */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                          {test.icon?.startsWith('http') ? (
                            <img src={test.icon} alt={test.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{test.icon || '📱'}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-zinc-900">{test.name}</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {test.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">{test.packageId}</p>
                          
                          {/* Coin Reward Breakdown */}
                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                              <Coins className="w-3.5 h-3.5" /> Total: {test.totalReward}
                            </span>
                            <span className="text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-xl font-semibold">
                              {test.dailyReward}
                            </span>
                            <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl font-semibold border border-amber-100">
                              + {test.completionBonus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex flex-wrap lg:flex-col items-end gap-3 shrink-0">
                        <button 
                          onClick={() => handleClaimToday(test)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
                        >
                          <Play className="w-4 h-4" /> Start Today's Check-in
                        </button>

                        <a 
                          href={test.playStoreUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 flex items-center gap-1.5 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open Google Play Opt-in
                        </a>
                      </div>
                    </div>

                    {/* Testing Instructions */}
                    <div className="mt-5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs">
                      <p className="font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                        <Info className="w-3.5 h-3.5 text-blue-600" /> Daily Testing Task:
                      </p>
                      <p className="text-zinc-600 leading-relaxed">{test.instructions}</p>
                    </div>

                    {/* 14-Day Visual Tracker Calendar */}
                    <div className="mt-6 pt-6 border-t border-zinc-100">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-zinc-900">
                          14-Day Test Track: <strong className="text-blue-600">{test.completedDays} / {test.totalDays} Days Verified</strong>
                        </span>
                        <span className="text-zinc-500 font-medium">{test.totalDays - test.completedDays} days until bonus payout</span>
                      </div>

                      <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
                        {Array.from({ length: 14 }).map((_, index) => {
                          const dayNum = index + 1;
                          const isDone = dayNum <= test.completedDays;
                          const isCurrent = dayNum === test.completedDays + 1;
                          return (
                            <div 
                              key={dayNum}
                              className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                                isDone 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                                  : isCurrent 
                                  ? 'bg-blue-600 border-blue-600 text-white font-black shadow-md shadow-blue-500/20 scale-105' 
                                  : 'bg-zinc-50 border-zinc-200 text-zinc-400 font-medium'
                              }`}
                            >
                              <span className="text-[9px] uppercase tracking-wider block">D{dayNum}</span>
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" />
                              ) : (
                                <Coins className="w-3 h-3 text-amber-500 mt-0.5" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* TAB 2: EXPLORE NEW APPS TO TEST */
            exploreApps.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-black text-zinc-900">No Apps in Marketplace Yet</h2>
                <p className="text-xs text-zinc-500 mt-1.5 max-w-sm">
                  When developers launch closed testing campaigns, they will appear here with real logos and rewards!
                </p>
                <Link 
                  href="/customer/projects"
                  className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  + Launch an App Campaign
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exploreApps.map(app => (
                  <div key={app.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {/* REAL LOGO */}
                        <div className="w-14 h-14 bg-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm">
                          {app.icon?.startsWith('http') ? (
                            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{app.icon || '📱'}</span>
                          )}
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-200">
                          {app.totalReward}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-zinc-900 line-clamp-1">{app.name}</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{app.packageId}</p>
                      <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed line-clamp-2">{app.instructions}</p>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
                        <span>Daily: <strong>{app.dailyReward}</strong></span>
                        <span>Track: <strong>14 Days</strong></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleJoinTest(app)}
                      className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      Join 14-Day Test Track <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Daily Feedback / Task Modal */}
          {showFeedbackModal && selectedTask && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm">
                      {selectedTask.icon?.startsWith('http') ? (
                        <img src={selectedTask.icon} alt={selectedTask.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{selectedTask.icon || '📱'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-zinc-900">
                        Day {selectedTask.completedDays + 1} Check-in: {selectedTask.name}
                      </h3>
                      <p className="text-xs text-zinc-500">Daily Reward: {selectedTask.dailyReward}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowFeedbackModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-900">
                    <p className="font-bold mb-1">Step 1: Open app on your Android phone for 2 minutes</p>
                    <p className="text-blue-800/80">Keep the app installed for 14 continuous days to qualify for the full bonus.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Today's Observations / Bug Feedback
                    </label>
                    <textarea 
                      rows={3} 
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g. Tested app navigation, checked notifications, smooth performance on Android."
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Attach Screenshot (Optional)
                    </label>
                    <div className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition">
                      <Upload className="w-5 h-5 mb-1 text-zinc-400" />
                      <span className="text-xs font-semibold">Click to attach screenshot proof</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitDailyLog}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
                  >
                    Submit & Claim Today's Coins
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
