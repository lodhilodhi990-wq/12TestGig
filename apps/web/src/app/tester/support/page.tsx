'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserLayout from '@/components/UserLayout';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mail,
  Smartphone
} from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  createdAt: any;
}

export default function SupportPage() {
  const { user, firebaseUser } = useAuth();
  const userId = firebaseUser?.uid || user?.id;

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payment / Coins Deposit');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'support_tickets'), where('userId', '==', userId));
      const unsub = onSnapshot(q, (snap) => {
        const list: Ticket[] = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Ticket));
        setTickets(list);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !subject) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: userId || 'anonymous',
        userName: firebaseUser?.displayName || (user as any)?.displayName || (user as any)?.name || 'User',
        userEmail: firebaseUser?.email || user?.email || '',
        subject,
        category,
        message,
        status: 'Open',
        createdAt: serverTimestamp()
      });

      // Also notify disputes/anti-scam radar if category is dispute
      if (category.includes('Scam') || category.includes('Dispute')) {
        await addDoc(collection(db, 'disputes'), {
          appName: subject,
          customerEmail: firebaseUser?.email || user?.email || '',
          testerEmail: 'support@12testgig.com',
          reason: message,
          status: 'Open',
          createdAt: serverTimestamp()
        });
      }

      setSuccessMsg(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      alert('Could not submit support request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does Google Play 14-Day Closed Testing work?',
      a: 'Google requires 20 opted-in testers to keep your app installed and actively test it for 14 continuous days. Our platform matches certified Android testers who submit daily proof to guarantee your production track approval.'
    },
    {
      q: 'When will my Coin Deposit be approved?',
      a: 'Manual deposits (JazzCash, Easypaisa, Bank Transfer, USDT) are usually verified and credited within 5 to 30 minutes by our 24/7 SaaS admin desk.'
    },
    {
      q: 'How do Testers withdraw earned cash?',
      a: 'Testers can cash out coins to JazzCash, Easypaisa, SadaPay, Local Bank IBAN, or USDT Crypto from their wallet. Standard SLA turnaround time is 1 to 24 hours.'
    },
    {
      q: 'What happens if a tester uploads a fake screenshot?',
      a: 'Our 4-layer AI & Hash security engine blocks duplicate images, validates device OS/model, and freezes rewards for fraudulent check-ins.'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['customer', 'tester', 'earner']}>
      <UserLayout>
        <div className="space-y-8 font-sans max-w-5xl pb-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                Live Support & 24/7 Help Desk
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Get assistance with testing campaigns, coin deposits, withdrawals, or report an issue.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Support Online
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-sm">
                <h3 className="text-base font-extrabold text-zinc-900 mb-1 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Submit a Support Ticket / Dispute
                </h3>
                <p className="text-xs text-zinc-500 mb-6">
                  Our operations team responds within 15-30 minutes.
                </p>

                {successMsg && (
                  <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    Ticket submitted successfully! Our support agents are reviewing your request.
                  </div>
                )}

                <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Issue Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Payment / Coins Deposit">💰 Payment / Coins Deposit Issue</option>
                      <option value="Withdrawal / Payout Status">💸 Withdrawal / Payout Status</option>
                      <option value="14-Day App Testing Task">📱 14-Day App Testing Task Issue</option>
                      <option value="Anti-Scam / Fraud Dispute">🛡️ Anti-Scam / Report Fraud Tester</option>
                      <option value="Account & General Question">👤 Account & General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Subject / App Name
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Deposit TID #12345 not verified or Question about Day 7 check-in"
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Detailed Message / Description
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please explain the issue in detail. Include transaction ID or screenshot details if applicable."
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3.5 text-xs font-medium text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Support Request
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* My Submitted Tickets */}
              {tickets.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-zinc-900">Your Support Tickets</h3>
                  <div className="space-y-2.5">
                    {tickets.map(t => (
                      <div key={t.id} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{t.subject}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{t.category}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: FAQs & Quick Direct Channels */}
            <div className="space-y-6">
              {/* Direct Support Card */}
              <div className="bg-gradient-to-br from-zinc-900 to-black text-white p-6 rounded-3xl shadow-xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">Priority Direct Support</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Need urgent help with an active Google Play closed test or instant deposit verification?
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-3 bg-zinc-800/80 rounded-xl flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">Email Support:</span>
                    <strong className="text-blue-400 font-mono">support@12testgig.com</strong>
                  </div>
                  <div className="p-3 bg-zinc-800/80 rounded-xl flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">Response SLA:</span>
                    <strong className="text-emerald-400 font-semibold">&lt; 30 Minutes</strong>
                  </div>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-zinc-900">Frequently Asked Questions</h4>
                <div className="space-y-2.5">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-zinc-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full p-3.5 text-left text-xs font-bold text-zinc-800 hover:bg-zinc-50 flex items-center justify-between transition cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                      </button>
                      {activeFaq === idx && (
                        <div className="p-3.5 pt-0 text-[11px] text-zinc-500 leading-relaxed bg-zinc-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
