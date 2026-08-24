'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Smartphone, 
  Coins, 
  ArrowRight, 
  Users, 
  Clock, 
  Shield, 
  Lock, 
  Award, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  ChevronRight,
  TrendingUp,
  UserCheck,
  Zap,
  Play,
  Eye
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function MarketingLandingPage() {
  const router = useRouter();

  // Instant Auth State on Landing Page
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState<'customer' | 'tester'>('customer');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Dynamic Pricing Simulator
  const [selectedPlan, setSelectedPlan] = useState<'googleplay' | 'quick' | 'growth'>('googleplay');

  const handleInstantAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const uid = userCredential.user.uid;

        // Save unified user profile in Firestore
        await setDoc(doc(db, 'users', uid), {
          id: uid,
          email: authEmail,
          displayName: authName || authEmail.split('@')[0],
          role: authRole,
          coinsBalance: authRole === 'customer' ? 500 : 200, // Welcome bonus
          coins: authRole === 'customer' ? 500 : 200,
          createdAt: serverTimestamp(),
          status: 'active'
        });

        setAuthSuccess(true);
        setTimeout(() => {
          if (authRole === 'customer') {
            router.push('/customer/projects');
          } else {
            router.push('/tester/tests');
          }
        }, 1000);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        setAuthSuccess(true);
        setTimeout(() => {
          router.push('/tester/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please switch to Sign In.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please try again.');
      } else {
        setAuthError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const reviews = [
    {
      name: 'Hassan Tariq',
      role: 'Indie Game Developer',
      app: 'Ludo Arena Champion 3D',
      text: 'Passed Google Play closed testing on my first attempt! 20 testers engaged daily for 14 continuous days without a single dropout. 100% recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Product Lead @ AppVibe',
      app: 'HabitSync Tracker',
      text: 'The anti-fraud duplicate screenshot blocker gave us complete peace of mind. We received real bug reports and genuine feedback for our evaluation questions.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Bilal Ahmed',
      role: 'Certified Android Tester',
      app: 'Earned Rs 18,500 PKR',
      text: 'Testing apps every day is simple and fun. Payouts arrive in my JazzCash account within a few hours. Super trustworthy platform!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">12 Test Gig</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                Google Play 14-Day Cloud
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#developers" className="hover:text-white transition">For Developers</a>
            <a href="#testers" className="hover:text-white transition">For Testers</a>
            <a href="#pricing" className="hover:text-white transition">Pricing Plans</a>
            <Link href="/blog" className="hover:text-white transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Blog & Guides
            </Link>
            <Link href="/tester/support" className="hover:text-white transition flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Support Desk
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#instant-auth"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <span>Get 20 Testers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Google AdSense Top Responsive Spot */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <AdSenseBanner slotType="header" />
      </div>

      {/* 2. HERO SECTION WITH EMBEDDED INSTANT AUTH */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Pass Google Play Closed Testing Guaranteed • 2026 Ready</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Get <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">20 Real Testers</span> for 14 Days. Pass Production Review.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-normal">
              Meet Google Play's 20-tester closed testing requirement effortlessly. Certified Android testers test your APK daily on real physical devices with verified screenshot telemetry and actionable bug reports.
            </p>

            {/* Trust Metric Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">99.4%</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Approval Rate on Google Play</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">14 Days</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Continuous Daily Testing</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">0 Bots</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">100% Real Physical Devices</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
                ].map((src, i) => (
                  <img key={i} src={src} alt="Developer" className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" />
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center text-amber-400">
                  {'★★★★★'}
                </div>
                <p className="text-slate-400 text-[11px] font-medium">Trusted by 2,400+ Android Developers & Studios</p>
              </div>
            </div>
          </div>

          {/* Right Column: EMBEDDED INSTANT SIGN-UP & LOGIN CARD */}
          <div id="instant-auth" className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">
                    {authMode === 'register' ? 'Create Free Account' : 'Sign In to Portal'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {authMode === 'register' ? 'Start testing your app or earn coins today' : 'Access your active campaigns & wallet'}
                  </p>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      authMode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      authMode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Success! Redirecting to your dashboard...
                </div>
              )}

              <form onSubmit={handleInstantAuth} className="space-y-4 text-xs">
                {authMode === 'register' && (
                  <>
                    {/* Role Selector */}
                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
                        I Want To:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAuthRole('customer')}
                          className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                            authRole === 'customer'
                              ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-blue-400">
                            <Rocket className="w-3.5 h-3.5" /> App Creator
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Need 20 Testers</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAuthRole('tester')}
                          className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                            authRole === 'tester'
                              ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <Coins className="w-3.5 h-3.5" /> Certified Tester
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Earn Real Cash</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        Full Name / Studio
                      </label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Omar Farooq"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : authMode === 'register' ? (
                    <>
                      <span>Create Account & Get 500 Bonus Coins</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-500">
                  By continuing, you agree to our <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link> and <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS DUAL SHOWCASE */}
      <section id="developers" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How Developers Pass Closed Testing in 14 Days
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Say goodbye to WhatsApp groups and unreliable friends. 12 Test Gig automates your closed testing pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Add Google Play Opt-in Link',
                desc: 'Paste your Google Group link and Web/Android opt-in URL into our creator dashboard.'
              },
              {
                step: '02',
                title: '20 Certified Testers Matched',
                desc: 'Our smart matching engine assigns 20 real Android users on verified physical devices.'
              },
              {
                step: '03',
                title: '14-Day Continuous Telemetry',
                desc: 'Testers complete structured daily interaction tasks and upload anti-cheat screenshot proof.'
              },
              {
                step: '04',
                title: 'Pass Production Approval',
                desc: 'Download your telemetry audit report to answer Google Play production evaluation form easily.'
              }
            ].map((st, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition">
                <span className="text-4xl font-black text-slate-800 group-hover:text-blue-500/20 transition font-mono absolute top-4 right-4">
                  {st.step}
                </span>
                <div className="relative z-10 space-y-2 mt-4">
                  <h3 className="text-base font-bold text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & SECURITY RADAR */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Zero Bot Policy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              4-Layer Anti-Fraud & Real Device Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Google's automated AI algorithm detects emulator farms and immediately rejects closed tests. 12 Test Gig ensures your test is 100% human and legitimate.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'Anti-Duplicate Screenshot Hash', desc: 'Prevents testers from submitting old or stolen screenshots.' },
                { title: '24-Hour Cooldown Cycle', desc: 'Guarantees genuine daily return visits across 14 consecutive days.' },
                { title: 'Escrow Smart-Lock Protection', desc: 'Coins are only disbursed to testers when milestone tasks are validated.' },
                { title: 'Free Replacement Guarantee', desc: 'If any tester drops out, our system instantly assigns a replacement for free.' }
              ].map((f, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{f.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                  <span className="text-sm font-black text-white">Google Play Compliance Engine</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full">
                  Active Shield ON
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target Testers:</span>
                  <strong className="text-white">20 Opted-in Users</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Continuous Duration:</span>
                  <strong className="text-emerald-400">14 Full Days (336 Hours)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Emulator Check:</span>
                  <strong className="text-emerald-400">0% Detected (100% Real OS)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Daily Milestones:</span>
                  <strong className="text-blue-400">14 / 14 Complete</strong>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/compliance"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  Read our Google Play Compliance Policy <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING PACKAGES SHOWCASE */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Pre-Configured Google Play Testing Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pay in USD or PKR via JazzCash, Easypaisa, Local Bank Transfer, or USDT Crypto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'quick',
                name: 'Quick Audit Pack',
                coins: '1,000 Coins',
                price: '$10 USD / Rs 2,800 PKR',
                testers: '10 Testers',
                days: '7 Days',
                popular: false,
                desc: 'Best for preliminary feedback and quick UX telemetry before closed testing.'
              },
              {
                id: 'googleplay',
                name: 'Google Play 14-Day Pack',
                coins: '2,000 Coins',
                price: '$20 USD / Rs 5,600 PKR',
                testers: '20 Verified Testers',
                days: '14 Continuous Days',
                popular: true,
                desc: 'Full closed testing package designed to meet Google Play Console production requirements.'
              },
              {
                id: 'growth',
                name: 'Studio Multi-App Pack',
                coins: '5,000 Coins',
                price: '$50 USD / Rs 14,000 PKR',
                testers: '30+ Testers',
                days: '14 Days / Multi-App',
                popular: false,
                desc: 'High priority VIP testing for gaming studios and agencies managing multiple apps.'
              }
            ].map(plan => (
              <div 
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition ${
                  plan.popular 
                    ? 'bg-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/20' 
                    : 'bg-slate-950 border border-slate-800'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                    Most Popular for Google Play
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400">{plan.desc}</p>

                  <div className="py-4 border-y border-slate-800 space-y-1">
                    <div className="text-3xl font-black text-white">{plan.coins}</div>
                    <div className="text-xs font-bold text-emerald-400">{plan.price}</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>{plan.testers}</strong> on real Android devices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>{plan.days}</strong> active testing track</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Free replacement guarantee</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href="#instant-auth"
                    className={`w-full py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Select Plan <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VERIFIED DEVELOPER REVIEWS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              Social Proof & Reviews
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Loved by Android Creators Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center text-amber-400 text-xs">
                    {'★★★★★'}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div>
                    <p className="text-xs font-bold text-white">{rev.name}</p>
                    <p className="text-[10px] text-blue-400">{rev.role} • <span className="text-slate-400">{rev.app}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-feed Ad Banner */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <AdSenseBanner slotType="inFeed" />
      </div>

      {/* 7. COMPREHENSIVE TRUST & COMPLIANCE FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-16 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-black text-base text-white">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              12 Test Gig
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              The premier Google Play 20-tester closed testing platform. Helping mobile developers pass production evaluation while rewarding certified Android testers worldwide.
            </p>
            <div className="text-[11px] text-slate-500">
              © 2026 12 Test Gig Inc. All rights reserved.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Developers</h4>
            <ul className="space-y-2">
              <li><a href="#developers" className="hover:text-white transition">20 Testers Track</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Coin Packages</a></li>
              <li><Link href="/customer/projects" className="hover:text-white transition">Launch App Test</Link></li>
              <li><Link href="/customer/billing" className="hover:text-white transition">Buy Coins</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Testers & Earners</h4>
            <ul className="space-y-2">
              <li><Link href="/tester/tests" className="hover:text-white transition">Explore Apps</Link></li>
              <li><Link href="/tester/wallet" className="hover:text-white transition">Withdraw Cash</Link></li>
              <li><Link href="/earner/dashboard" className="hover:text-white transition">Affiliate 10%</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Testing Guides</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Legal & AdSense</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/compliance" className="hover:text-white transition">Play Store Compliance</Link></li>
              <li><Link href="/refund" className="hover:text-white transition">Refund & Escrow</Link></li>
              <li><Link href="/tester/support" className="hover:text-white transition">24/7 Help Desk</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
