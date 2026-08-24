import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Coins, 
  ShieldCheck
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Withdrawal {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  amountCoins: number;
  amountUsd: number;
  amountPkr: number;
  method: 'easypaisa' | 'jazzcash' | 'bank' | 'payoneer';
  accountNumber: string;
  accountTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  transactionId?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Withdrawal | null>(null);
  const [adminTid, setAdminTid] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // 1. Listen to live withdrawal_requests in Firestore
    try {
      const q = query(collection(db, 'withdrawal_requests'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const list: Withdrawal[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Withdrawal);
        });
        setWithdrawals(list);
      }, (err) => {
        console.warn('Firestore withdrawals fallback notice', err);
        const unsubFallback = onSnapshot(collection(db, 'withdrawal_requests'), (snapshot) => {
          const list: Withdrawal[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Withdrawal);
          });
          setWithdrawals(list);
        });
        return () => unsubFallback();
      });
      return () => unsub();
    } catch (e) {
      console.error('Withdrawals subscription error:', e);
    }
  }, []);

  const handleApproveAndPay = async (w: Withdrawal) => {
    setActionLoading(true);
    const updated = withdrawals.map(item => {
      if (item.id === w.id) {
        return { ...item, status: 'paid' as const, transactionId: adminTid || `TID-${Date.now().toString().slice(-6)}` };
      }
      return item;
    });

    setWithdrawals(updated);
    localStorage.setItem('admin_withdrawal_requests', JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'withdrawal_requests', w.id), {
        status: 'paid',
        transactionId: adminTid || `TID-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore update note', e);
    } finally {
      setActionLoading(false);
      setSelectedTx(null);
      setAdminTid('');
      alert(`Withdrawal for ${w.userName} (${w.amountCoins.toLocaleString()} Coins) marked as PAID!`);
    }
  };

  const handleReject = async (w: Withdrawal) => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejecting the withdrawal request.');
      return;
    }

    setActionLoading(true);
    const updated = withdrawals.map(item => {
      if (item.id === w.id) {
        return { ...item, status: 'rejected' as const, rejectionReason: rejectReason };
      }
      return item;
    });

    setWithdrawals(updated);
    localStorage.setItem('admin_withdrawal_requests', JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'withdrawal_requests', w.id), {
        status: 'rejected',
        rejectionReason: rejectReason,
        rejectedAt: new Date().toISOString()
      });

      // Automatically Refund Coins to User
      if (w.userId) {
        const userRef = doc(db, 'users', w.userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const curBal = Number(snap.data()?.coinsBalance || snap.data()?.coins || 0);
          const refundedBal = curBal + Number(w.amountCoins || 0);
          await updateDoc(userRef, {
            coinsBalance: refundedBal,
            coins: refundedBal,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn('Firestore update note', e);
    } finally {
      setActionLoading(false);
      setSelectedTx(null);
      setRejectReason('');
      alert(`Withdrawal request rejected and ${w.amountCoins.toLocaleString()} coins automatically refunded to tester.`);
    }
  };

  const filtered = withdrawals.filter(w => {
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesQuery = w.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const totalPendingPkr = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((acc, curr) => acc + curr.amountPkr, 0);

  const totalPaidUsd = withdrawals
    .filter(w => w.status === 'paid')
    .reduce((acc, curr) => acc + curr.amountUsd, 0);

  return (
    <div className="space-y-6 font-sans max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
            Tester & Earner Withdrawals Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, verify, and mark tester payouts as paid across Easypaisa, JazzCash, Local Banks, and Payoneer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Firestore Sync
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending Payout Queue
          </span>
          <p className="text-2xl font-black text-white mt-1">
            {withdrawals.filter(w => w.status === 'pending').length} Requests
          </p>
          <p className="text-xs text-amber-400 font-bold mt-1">Total: Rs {totalPendingPkr.toLocaleString()} PKR</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Total Paid Out
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">${totalPaidUsd.toFixed(2)} USD</p>
          <p className="text-xs text-slate-400 mt-1">
            {withdrawals.filter(w => w.status === 'paid').length} Completed Payouts
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Payout SLA & Verification
          </span>
          <p className="text-2xl font-black text-white mt-1">100% Safe</p>
          <p className="text-xs text-slate-400 mt-1">Direct to Easypaisa / IBAN</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by tester, email, or account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'paid', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Withdrawals Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Tester Name & Email</th>
                <th className="p-4">Coins Requested</th>
                <th className="p-4">Payout Value</th>
                <th className="p-4">Payment Method & Account</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-mono font-bold text-slate-300">{w.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{w.userName}</p>
                    <p className="text-[11px] text-slate-400">{w.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-black text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{w.amountCoins.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-emerald-400">Rs {w.amountPkr.toLocaleString()} PKR</p>
                    <p className="text-[10px] text-slate-400">≈ ${w.amountUsd.toFixed(2)} USD</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs">
                        {w.method === 'easypaisa' || w.method === 'jazzcash' ? '📱' : w.method === 'bank' ? '🏦' : '🌐'}
                      </div>
                      <div>
                        <p className="font-bold text-white capitalize">{w.method}</p>
                        <p className="text-[10px] text-slate-300 font-mono">{w.accountNumber}</p>
                        <p className="text-[10px] text-slate-500">Title: {w.accountTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {w.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                    {w.status === 'paid' && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                        {w.transactionId && (
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">{w.transactionId}</p>
                        )}
                      </div>
                    )}
                    {w.status === 'rejected' && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                        {w.rejectionReason && (
                          <p className="text-[9px] text-red-400 mt-0.5 truncate max-w-[120px]">{w.rejectionReason}</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {w.status === 'pending' ? (
                      <button 
                        onClick={() => setSelectedTx(w)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Process Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROCESS PAYOUT MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 text-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  Process Withdrawal: {selectedTx.userName}
                </h3>
                <p className="text-xs text-slate-400">Request #{selectedTx.id}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Coins Deducted:</span>
                <span className="font-black text-amber-400">{selectedTx.amountCoins.toLocaleString()} Coins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total to Send (PKR):</span>
                <span className="font-black text-emerald-400 text-sm">Rs {selectedTx.amountPkr.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="font-bold text-white capitalize">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-bold text-white font-mono">{selectedTx.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Title:</span>
                <span className="font-bold text-white">{selectedTx.accountTitle}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Bank / Easypaisa Transaction ID (Optional Proof)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. TRX-90412849182"
                  value={adminTid}
                  onChange={(e) => setAdminTid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Rejection Reason (Only if rejecting request)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Account number invalid or name mismatch"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReject(selectedTx)}
                  className="flex-1 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl transition"
                >
                  Reject & Refund
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleApproveAndPay(selectedTx)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  {actionLoading ? 'Processing...' : 'Approve & Mark Paid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
