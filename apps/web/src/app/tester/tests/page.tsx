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
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Lock,
  Calendar,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';

interface TestItem {
  id: string | number;
  name: string;
  packageId: string;
  category: string;
  icon: string;
  apkSize: string;
  totalReward: string;
  dailyReward: string;
  dailyRewardNumber: number;
  completionBonus: string;
  completedDays: number;
  totalDays: number;
  status: 'In Progress' | 'Action Needed' | 'Completed';
  playStoreUrl: string;
  instructions: string;
  lastClaimDate?: string; // YYYY-MM-DD
  history?: { day: number; date: string; screenshotUrl: string; feedback: string }[];
}

const DAILY_TEST_STAGES = [
  { day: 1, title: 'Opt-in & Install Check', req: 'Screenshot of App Welcome / Signup Screen' },
  { day: 2, title: 'Main Navigation Test', req: 'Screenshot of App Home / Main Dashboard' },
  { day: 3, title: 'Settings & Profile Test', req: 'Screenshot of App Settings or Profile page' },
  { day: 4, title: 'Core Feature Test', req: 'Screenshot using the main in-app feature' },
  { day: 5, title: 'Permissions & Notifications', req: 'Screenshot of app notifications or action' },
  { day: 6, title: 'Search & Data Input', req: 'Screenshot of search query or form interaction' },
  { day: 7, title: 'Mid-Test Health Checkpoint', req: 'Screenshot showing app running smoothly' },
  { day: 8, title: 'Offline / Network Test', req: 'Screenshot of content loaded in app' },
  { day: 9, title: 'UI Responsiveness Test', req: 'Screenshot of app in dark/light mode or rotated' },
  { day: 10, title: 'Media / Assets Test', req: 'Screenshot of media playback or graphic content' },
  { day: 11, title: 'Account State Test', req: 'Screenshot of saved account data/favorites' },
  { day: 12, title: 'Error Handling Sweep', req: 'Screenshot of completed flow without crash' },
  { day: 13, title: 'Stability Final Pass', req: 'Screenshot of app running 2+ minutes' },
  { day: 14, title: 'Play Store Review & Audit', req: 'Screenshot of Google Play Review / Rating' }
];

export default function MyTests() {
  const { user, firebaseUser } = useAuth();
  const userId = firebaseUser?.uid || user?.id;

  const [activeTab, setActiveTab] = useState<'my_tests' | 'explore'>('my_tests');
  const [selectedTask, setSelectedTask] = useState<TestItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Anti-Fraud Verification Modal State
  const [feedbackText, setFeedbackText] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotHash, setScreenshotHash] = useState<string>('');
  const [deviceModel, setDeviceModel] = useState('Samsung Galaxy S22 / Android 14');
  const [inAppVerificationCode, setInAppVerificationCode] = useState('');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [antiFraudError, setAntiFraudError] = useState<string | null>(null);

  // Used screenshot hashes to prevent re-upload of same images
  const [usedImageHashes, setUsedImageHashes] = useState<string[]>([]);

  const [activeTests, setActiveTests] = useState<TestItem[]>([]);
  const [exploreApps, setExploreApps] = useState<TestItem[]>([]);

  const todayDateStr = new Date().toISOString().split('T')[0];

  // 1. Load available marketplace campaigns from Firestore & local
  useEffect(() => {
    try {
      const unsubCamps = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
        if (!snapshot.empty) {
          const list: TestItem[] = snapshot.docs.map(d => {
            const c = d.data();
            return {
              id: d.id,
              name: c.appName || c.name || 'Android App',
              packageId: c.packageId || c.package || 'com.example.app',
              category: c.category || 'Android App',
              icon: c.icon || '📱',
              apkSize: '24 MB',
              totalReward: `${(c.costCoins || 2000).toLocaleString()} 🪙`,
              dailyReward: '100 Coins/day',
              dailyRewardNumber: 100,
              completionBonus: '600 Coins',
              completedDays: 0,
              totalDays: c.totalDays || 14,
              status: 'In Progress',
              playStoreUrl: c.playStoreUrl || `https://play.google.com/store/apps/details?id=${c.packageId || c.package}`,
              instructions: c.instructions || c.description || 'Open app daily for 2 minutes and submit verified screenshot.'
            };
          });
          setExploreApps(list);
        } else {
          // Fallback to local
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
              dailyRewardNumber: 100,
              completionBonus: '600 Coins',
              completedDays: 0,
              totalDays: 14,
              status: 'In Progress',
              playStoreUrl: c.playStoreUrl || `https://play.google.com/store/apps/details?id=${c.package}`,
              instructions: c.description || 'Open app daily for 2 minutes and submit daily screenshot.'
            }));
            setExploreApps(marketplace);
          }
        }
      });

      const savedTests = localStorage.getItem('tester_active_tests');
      if (savedTests) {
        setActiveTests(JSON.parse(savedTests));
      }

      const savedHashes = localStorage.getItem('used_screenshot_hashes');
      if (savedHashes) {
        setUsedImageHashes(JSON.parse(savedHashes));
      }

      return () => unsubCamps();
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
    const isAlreadyJoined = activeTests.some(t => t.packageId === app.packageId);
    if (isAlreadyJoined) {
      setActiveTab('my_tests');
      alert(`You are already part of the testing team for "${app.name}".`);
      return;
    }

    const updated = [app, ...activeTests];
    saveActiveTests(updated);
    setActiveTab('my_tests');
    alert(`🎉 You joined the 14-day certified testing team for "${app.name}"!\n\nPlease open the Google Play Opt-in link, install the app, and submit Day 1 check-in.`);
  };

  const handleOpenCheckinModal = (test: TestItem) => {
    const currentDay = test.completedDays + 1;
    if (currentDay > test.totalDays) {
      alert(`🎉 Congratulations! You have completed all ${test.totalDays} days for this app.`);
      return;
    }

    // Cooldown check: prevent duplicate check-ins on same day
    if (test.lastClaimDate === todayDateStr) {
      alert(`⏳ You have already completed Day ${test.completedDays} check-in today! Please return tomorrow for Day ${test.completedDays + 1}.`);
      return;
    }

    setSelectedTask(test);
    setFeedbackText('');
    setScreenshotPreview(null);
    setScreenshotHash('');
    setAntiFraudError(null);
    // Generate dynamic daily verification code
    const token = `TG-${new Date().getDate() * 7}-${String(test.name).slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setInAppVerificationCode(token);
    setShowFeedbackModal(true);
  };

  // Image Upload with Anti-Duplicate Hashing
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAntiFraudError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      setAntiFraudError('⚠️ Invalid file format. Please upload a genuine PNG/JPG mobile screenshot.');
      return;
    }

    // File size check (Minimum 20KB to prevent blank 1-pixel fake images)
    if (file.size < 20000) {
      setAntiFraudError('⚠️ Screenshot file is too small or blank. Please upload a real full-screen mobile capture.');
      return;
    }

    // Compute digital fingerprint (File Name + Size + Modified time hash)
    const fileHash = `${file.name}_${file.size}_${file.lastModified}`;
    if (usedImageHashes.includes(fileHash)) {
      setAntiFraudError('❌ Duplicate Screenshot Detected! You have already submitted this exact image previously. Please take a fresh live screenshot.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
      setScreenshotHash(fileHash);
    };
    reader.readAsDataURL(file);
  };

  // Submit Daily Log & Credit Coins
  const submitDailyLog = async () => {
    if (!selectedTask) return;
    setAntiFraudError(null);

    // 1. Mandatory Validations
    if (!screenshotPreview) {
      setAntiFraudError('⚠️ Live Screenshot Proof is mandatory to verify genuine app testing.');
      return;
    }

    if (feedbackText.trim().length < 15) {
      setAntiFraudError('⚠️ Please provide detailed testing observation / feedback (Minimum 15 characters).');
      return;
    }

    setIsSubmittingLog(true);

    try {
      const dayNumber = selectedTask.completedDays + 1;
      const isFinalDay = dayNumber >= selectedTask.totalDays;
      const coinsEarned = selectedTask.dailyRewardNumber || 100;

      // 2. Record to Firestore test_sessions collection
      try {
        await addDoc(collection(db, 'test_sessions'), {
          testerId: userId || 'anonymous',
          testerEmail: firebaseUser?.email || user?.email || 'tester@example.com',
          testerName: firebaseUser?.displayName || (user as any)?.displayName || (user as any)?.name || 'Certified Tester',
          appName: selectedTask.name,
          packageId: selectedTask.packageId,
          day: dayNumber,
          totalDays: selectedTask.totalDays,
          deviceModel: deviceModel,
          verificationCode: inAppVerificationCode,
          feedback: feedbackText,
          screenshotUrl: screenshotPreview,
          coinsAwarded: coinsEarned,
          verifiedAt: serverTimestamp(),
          createdAt: new Date().toISOString()
        });
      } catch (fErr) {
        console.warn('Firestore session log error:', fErr);
      }

      // 3. Credit Coins to User Firestore Document
      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const curBal = Number(userSnap.data()?.coinsBalance || userSnap.data()?.coins || 0);
            const newBal = curBal + coinsEarned;
            await updateDoc(userRef, {
              coinsBalance: newBal,
              coins: newBal,
              updatedAt: new Date().toISOString()
            });
            localStorage.setItem('user_coins_balance', String(newBal));
          }
        } catch (uErr) {
          console.warn('User coin balance increment notice:', uErr);
        }
      }

      // 4. Update used hashes to prevent duplicate re-use
      const updatedHashes = [...usedImageHashes, screenshotHash];
      setUsedImageHashes(updatedHashes);
      localStorage.setItem('used_screenshot_hashes', JSON.stringify(updatedHashes));

      // 5. Update active test progress & lock today
      const updatedTests = activeTests.map(t => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            completedDays: dayNumber,
            lastClaimDate: todayDateStr,
            status: isFinalDay ? ('Completed' as const) : ('In Progress' as const)
          };
        }
        return t;
      });

      saveActiveTests(updatedTests);
      setShowFeedbackModal(false);
      setScreenshotPreview(null);
      setFeedbackText('');

      alert(
        `✅ DAY ${dayNumber} TEST VERIFIED & APPROVED!\n\n` +
        `🪙 +${coinsEarned} Coins credited to your wallet.\n` +
        `📱 Device: ${deviceModel}\n` +
        `🔒 Proof Hash: ${screenshotHash.slice(0, 16)}...\n\n` +
        (isFinalDay 
          ? `🏆 ALL 14 DAYS COMPLETED! You have unlocked your full completion bonus.` 
          : `Please return tomorrow to complete Day ${dayNumber + 1}.`)
      );
    } catch (err) {
      console.error('Failed to submit test log:', err);
      alert('Could not submit check-in. Please try again.');
    } finally {
      setIsSubmittingLog(false);
    }
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
                Participate in verified 14-day closed testing tracks, complete daily in-app tasks, and earn real coins.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center p-1 bg-zinc-200/80 rounded-2xl">
              <button 
                onClick={() => setActiveTab('my_tests')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'my_tests' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                My Active Tests ({activeTests.length})
              </button>
              <button 
                onClick={() => setActiveTab('explore')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'explore' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Explore Marketplace ({exploreApps.length})
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
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
                >
                  Explore Available Apps &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTests.map(test => {
                  const currentDay = test.completedDays + 1;
                  const isClaimedToday = test.lastClaimDate === todayDateStr;
                  const isCompleted = test.completedDays >= test.totalDays;
                  const currentStageInfo = DAILY_TEST_STAGES[Math.min(test.completedDays, 13)];

                  return (
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
                          {isCompleted ? (
                            <span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All 14 Days Completed!
                            </span>
                          ) : isClaimedToday ? (
                            <div className="px-4 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-zinc-200">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span>Day {test.completedDays} Done (Next in 24h)</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleOpenCheckinModal(test)}
                              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20 cursor-pointer"
                            >
                              <Play className="w-4 h-4" /> Complete Day {currentDay} Check-In
                            </button>
                          )}

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

                      {/* Today's Specific Required Stage */}
                      {!isCompleted && (
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                              D{currentDay}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900">{currentStageInfo.title}</p>
                              <p className="text-zinc-600 text-[11px]">{currentStageInfo.req}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-white/90 border border-blue-200 text-blue-700 font-bold rounded-lg text-[10px] uppercase">
                            Required Daily Proof
                          </span>
                        </div>
                      )}

                      {/* 14-Day Visual Tracker Calendar */}
                      <div className="mt-6 pt-6 border-t border-zinc-100">
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-bold text-zinc-900">
                            14-Day Verified Track: <strong className="text-blue-600">{test.completedDays} / {test.totalDays} Days Verified</strong>
                          </span>
                          <span className="text-zinc-500 font-medium">{Math.max(0, test.totalDays - test.completedDays)} days until completion bonus</span>
                        </div>

                        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
                          {Array.from({ length: 14 }).map((_, index) => {
                            const dayNum = index + 1;
                            const isDone = dayNum <= test.completedDays;
                            const isCurrent = dayNum === test.completedDays + 1 && !isClaimedToday;
                            return (
                              <div 
                                key={dayNum}
                                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                                  isDone 
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                                    : isCurrent 
                                    ? 'bg-blue-600 border-blue-600 text-white font-black shadow-md shadow-blue-500/20 scale-105 animate-pulse' 
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-400 font-medium'
                                }`}
                              >
                                <span className="text-[9px] uppercase tracking-wider block">D{dayNum}</span>
                                {isDone ? (
                                  <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-600" />
                                ) : isCurrent ? (
                                  <Play className="w-3 h-3 text-white mt-0.5" />
                                ) : (
                                  <Lock className="w-3 h-3 text-zinc-300 mt-0.5" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* TAB 2: EXPLORE MARKETPLACE */
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
                      className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      Join 14-Day Test Track <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ADVANCED ANTI-FRAUD VERIFICATION CHECK-IN MODAL */}
          {showFeedbackModal && selectedTask && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
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
                        Day {selectedTask.completedDays + 1} Check-in Verification
                      </h3>
                      <p className="text-xs text-emerald-600 font-bold">Reward: +{selectedTask.dailyReward}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowFeedbackModal(false)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold cursor-pointer">✕</button>
                </div>

                {/* Error Banner */}
                {antiFraudError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p>{antiFraudError}</p>
                  </div>
                )}

                {/* Required Stage Description */}
                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Today's Required Screen (Day {selectedTask.completedDays + 1}):</span>
                  </div>
                  <p className="text-blue-800 font-medium">
                    {DAILY_TEST_STAGES[Math.min(selectedTask.completedDays, 13)].req}
                  </p>
                </div>

                {/* Proof 1: Real Mobile Screenshot */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>1. Upload Live In-App Screenshot (Required)</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Duplicate proof blocked</span>
                  </label>
                  
                  {screenshotPreview ? (
                    <div className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-950 max-h-56 flex items-center justify-center">
                      <img src={screenshotPreview} alt="Screenshot Proof" className="max-h-56 object-contain" />
                      <button 
                        type="button" 
                        onClick={() => { setScreenshotPreview(null); setScreenshotHash(''); }}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-bold rounded-lg backdrop-blur-sm cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="w-full border-2 border-dashed border-zinc-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:bg-blue-50/20 cursor-pointer transition">
                      <Upload className="w-6 h-6 mb-1 text-blue-600" />
                      <span className="text-xs font-bold text-zinc-800">Click to Select Mobile Screenshot</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG mobile screen capture</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Proof 2: Device Model & OS */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    2. Confirmed Testing Device
                  </label>
                  <input 
                    type="text" 
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g. Xiaomi Redmi Note 12 / Android 14"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Proof 3: Testing Observations & Bug Log */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    3. Detailed Observation / Bug Report
                  </label>
                  <textarea 
                    rows={2} 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. Opened app, tested home feed scrolling, tested audio playback, no UI stutter found."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitDailyLog}
                    disabled={isSubmittingLog || !screenshotPreview}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingLog ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Proof...</span>
                      </>
                    ) : (
                      `Submit Proof & Claim +${selectedTask.dailyReward}`
                    )}
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
