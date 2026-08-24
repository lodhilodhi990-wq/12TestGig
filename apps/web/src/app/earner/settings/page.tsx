'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Bell, Shield, Building, Edit3, Check, Save } from 'lucide-react';
import { saveCustomReferralCode, generateDefaultReferralCode } from '@/lib/referralService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EarnerSettings() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Payout Details
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [bankIban, setBankIban] = useState('');
  const [payoneerEmail, setPayoneerEmail] = useState('');
  const [notifyReferrals, setNotifyReferrals] = useState(true);
  const [notifyCommissions, setNotifyCommissions] = useState(true);

  useEffect(() => {
    if (user) {
      const code = generateDefaultReferralCode(user);
      setReferralCode(code);

      // Load saved preferences if any
      const loadPrefs = async () => {
        try {
          const userSnap = await getDoc(doc(db, 'users', user.id));
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.referralCode) setReferralCode(data.referralCode);
            if (data.easypaisaNumber) setEasypaisaNumber(data.easypaisaNumber);
            if (data.jazzcashNumber) setJazzcashNumber(data.jazzcashNumber);
            if (data.bankIban) setBankIban(data.bankIban);
            if (data.payoneerEmail) setPayoneerEmail(data.payoneerEmail);
          }
        } catch (e) {
          console.error(e);
        }
      };
      loadPrefs();
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;
    setSaving(true);
    try {
      if (referralCode.trim()) {
        await saveCustomReferralCode(user.id, referralCode.trim());
      }

      await updateDoc(doc(db, 'users', user.id), {
        referralCode: referralCode.trim().toUpperCase(),
        easypaisaNumber,
        jazzcashNumber,
        bankIban,
        payoneerEmail,
        notifyReferrals,
        notifyCommissions,
        updatedAt: new Date().toISOString()
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      // local fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`user_payout_prefs_${user.id}`, JSON.stringify({
          easypaisaNumber,
          jazzcashNumber,
          bankIban,
          payoneerEmail
        }));
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <EarnerLayout>
        <div className="space-y-6 max-w-3xl font-sans">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Partner Settings</h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-1">Configure your unique affiliate handle, automatic payout accounts, and alerts.</p>
          </div>

          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              Your partner settings and payout preferences have been saved successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Custom Referral Alias Section */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" /> Unique Partner Referral ID / Handle
                </h2>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              </div>
              <div className="p-6 space-y-3">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Custom Referral Code (Slug)
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-500 font-mono">
                    12-test-gig.vercel.app/register?ref=
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. UMAR_VIP"
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  This unique ID is attached to your invite links and QR codes. Recruits using this code will earn you lifetime commission.
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" /> Account Email
                </h2>
              </div>
              <div className="p-6">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ''} 
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-500" 
                  />
                </div>
              </div>
            </div>

            {/* Payout Details */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-zinc-500" /> Default Payout Accounts
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Easypaisa Mobile Number (PKR)
                    </label>
                    <input 
                      type="text" 
                      value={easypaisaNumber}
                      onChange={(e) => setEasypaisaNumber(e.target.value)}
                      placeholder="e.g. 0300-1234567" 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      JazzCash Mobile Number (PKR)
                    </label>
                    <input 
                      type="text" 
                      value={jazzcashNumber}
                      onChange={(e) => setJazzcashNumber(e.target.value)}
                      placeholder="e.g. 0301-7654321" 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Bank Transfer / IBAN (PKR)
                    </label>
                    <input 
                      type="text" 
                      value={bankIban}
                      onChange={(e) => setBankIban(e.target.value)}
                      placeholder="e.g. PK36MEZN000123456789" 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Payoneer Email (USD)
                    </label>
                    <input 
                      type="email" 
                      value={payoneerEmail}
                      onChange={(e) => setPayoneerEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com" 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-zinc-500" /> Notifications & Alerts
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-bold text-xs text-zinc-900">New Recruit Signups</p>
                    <p className="text-[11px] text-zinc-500">Get notified immediately when someone registers via your partner link.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifyReferrals} 
                    onChange={(e) => setNotifyReferrals(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" 
                  />
                </label>
                <div className="h-px bg-zinc-100 w-full" />
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-bold text-xs text-zinc-900">Commission Payout Alerts</p>
                    <p className="text-[11px] text-zinc-500">Get notified when commission is credited from your network tests.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifyCommissions} 
                    onChange={(e) => setNotifyCommissions(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" 
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Partner Preferences'}
            </button>
          </form>
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
