'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Code, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import { registerReferralRelationship } from '@/actions/referral';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const [refCode, setRefCode] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const ref = searchParams?.get('ref');
    const camp = searchParams?.get('campaign');
    const chan = searchParams?.get('channel') || searchParams?.get('utm_source');

    if (ref) {
      setRefCode(ref);
      localStorage.setItem('pending_referral_code', ref);
    } else {
      const cachedRef = localStorage.getItem('pending_referral_code');
      if (cachedRef) setRefCode(cachedRef);
    }

    if (camp) {
      setCampaign(camp);
      localStorage.setItem('pending_referral_campaign', camp);
    }
    if (chan) {
      setChannel(chan);
      localStorage.setItem('pending_referral_channel', chan);
    }
  }, [searchParams]);

  const getFriendlyErrorMessage = (err: any) => {
    const code = err?.code || '';
    if (code.includes('email-already-in-use')) {
      return 'Yeh email already registered hai. Meherbani karke Login page par jayein.';
    }
    if (code.includes('weak-password')) {
      return 'Password kam az kam 6 characters ka hona chahiye.';
    }
    if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) {
      return 'Google sign-up window close kar di gayi thi. Dobara koshish karein.';
    }
    if (code.includes('invalid-email')) {
      return 'Durust email format likhein (e.g. yourname@gmail.com).';
    }
    return err?.message || 'Registration failed. Please check your information.';
  };

  const recordReferralForNewUser = async (userId: string, userName: string, userEmail: string) => {
    if (!refCode) return;
    try {
      // 1. Call server action
      await registerReferralRelationship(userId, refCode, campaign || 'direct', channel || 'organic');

      // 2. Also cache in local storage for instant demo/offline sync
      const newRecruit = {
        id: userId,
        userId,
        name: userName || 'New Recruit',
        email: userEmail,
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        campaign: campaign || 'Direct',
        channel: channel || 'Organic',
        completedTests: 0,
        totalCommissionGenerated: 0,
        status: 'Pending First Test',
        qualityScore: '5.0/5'
      };

      const key = `user_recruits_${refCode}`;
      const existing = localStorage.getItem(key);
      let list = [];
      if (existing) {
        try { list = JSON.parse(existing); } catch(e) {}
      }
      list.push(newRecruit);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      const userDoc = {
        id: userCredential.user.uid,
        fullName: fullName.trim() || 'New User',
        email: email.trim(),
        role: 'tester',
        status: 'active',
        coins: refCode ? 50 : 0, // Welcome bonus if referred
        trustScore: 95,
        emailVerified: false,
        referredBy: refCode || null,
        referralCampaign: campaign || null,
        referralChannel: channel || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc, { merge: true });
      await recordReferralForNewUser(userCredential.user.uid, fullName.trim(), email.trim());

      localStorage.removeItem('pending_referral_code');
      router.push('/tester/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const userDoc = {
          id: user.uid,
          fullName: user.displayName || 'Google User',
          email: user.email,
          role: 'tester',
          status: 'active',
          coins: refCode ? 50 : 0, // Welcome bonus if referred
          trustScore: 98,
          emailVerified: true,
          referredBy: refCode || null,
          referralCampaign: campaign || null,
          referralChannel: channel || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, userDoc, { merge: true });
        await recordReferralForNewUser(user.uid, user.displayName || 'Google User', user.email || '');
      }

      localStorage.removeItem('pending_referral_code');
      router.push('/tester/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-zinc-200 shadow-xl relative overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
          <Code className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-zinc-500 mt-1">
          All-in-One: Launch 20-tester tests, test apps & earn coins
        </p>
      </div>

      {/* Referral Welcome Banner */}
      {refCode && (
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <Gift className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <p className="font-extrabold text-blue-900">Partner Invitation Active!</p>
            <p className="text-[11px] text-blue-700">
              Referred by: <strong className="font-mono">{refCode}</strong>. Bonus coins unlocked!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed animate-in fade-in">
          {error}
        </div>
      )}

      {/* 1-Click Google Sign Up */}
      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs rounded-2xl transition mb-4 shadow-sm disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        1-Click Sign Up with Gmail (Google)
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="px-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Or with Email & Password</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Full Name</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="e.g. Umar Hayat"
              required 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com"
              required 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Min 6 characters"
              required 
              minLength={6}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:from-indigo-500 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-zinc-500">
        Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
      <Suspense fallback={<div className="text-zinc-500 text-xs font-bold">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
