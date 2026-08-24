import { useState, useEffect } from 'react';
import { Eye, Coins, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Deposit {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  amountUsd: string;
  amountPkr: string;
  coinsToCredit: string;
  coinsNumber?: number;
  method: string;
  accountSender: string;
  receiptUrl: string;
  note?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Deposits() {
  const [selectedReceipt, setSelectedReceipt] = useState<Deposit | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'deposits'), (snapshot) => {
        const liveList: Deposit[] = snapshot.docs.map(doc => {
          const data = doc.data();
          let formattedTime = 'Just now';
          if (data.createdAt?.toDate) {
            formattedTime = data.createdAt.toDate().toLocaleString();
          } else if (data.timestamp) {
            formattedTime = new Date(data.timestamp).toLocaleString();
          }

          return {
            id: doc.id,
            userId: data.userId || '',
            userEmail: data.userEmail || 'user@example.com',
            userName: data.userName || 'Developer User',
            amountUsd: data.amountUsd || '$0.00',
            amountPkr: data.amountPkr || '0 PKR',
            coinsToCredit: data.coinsToCredit || '0 🪙',
            coinsNumber: data.coinsNumber || 0,
            method: data.method || 'Manual Transfer',
            accountSender: data.accountSender || 'N/A',
            receiptUrl: data.receiptUrl || '',
            note: data.note || '',
            timestamp: formattedTime,
            status: data.status || 'pending',
          };
        });

        // Sort descending by timestamp
        liveList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setDeposits(liveList);
        setLoading(false);
      }, (error) => {
        console.warn('Deposits listener notice:', error);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Deposits listener catch:', e);
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (depItem: Deposit, newStatus: 'approved' | 'rejected') => {
    try {
      const depositRef = doc(db, 'deposits', depItem.id);
      await updateDoc(depositRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // If approved, automatically credit coins to the user's Firestore account
      if (newStatus === 'approved' && depItem.coinsNumber) {
        if (depItem.userId) {
          try {
            const userRef = doc(db, 'users', depItem.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const current = Number(userSnap.data()?.coinsBalance || userSnap.data()?.coins || 0);
              const newBal = current + depItem.coinsNumber;
              await updateDoc(userRef, {
                coinsBalance: newBal,
                coins: newBal,
                updatedAt: new Date().toISOString()
              });
            }

            // Create in-app notification
            await addDoc(collection(db, 'notifications'), {
              userId: depItem.userId,
              title: '🪙 Deposit Approved & Coins Credited!',
              message: `Your deposit of ${depItem.amountUsd} (${depItem.coinsToCredit}) has been verified. Coins are ready in your wallet.`,
              type: 'deposit',
              read: false,
              link: '/customer/billing',
              createdAt: serverTimestamp()
            });
          } catch (uErr) {
            console.warn('Failed to auto-increment user coins balance:', uErr);
          }
        }
      } else if (newStatus === 'rejected' && depItem.userId) {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: depItem.userId,
            title: '❌ Deposit Request Rejected',
            message: `Your deposit request of ${depItem.amountUsd} via ${depItem.method} was rejected. Please verify your receipt TID and resubmit.`,
            type: 'deposit',
            read: false,
            link: '/customer/billing',
            createdAt: serverTimestamp()
          });
        } catch (nErr) {
          console.warn('Notification error:', nErr);
        }
      }

      setDeposits(prev => prev.map(d => d.id === depItem.id ? { ...d, status: newStatus } : d));
      if (selectedReceipt && selectedReceipt.id === depItem.id) {
        setSelectedReceipt(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update deposit status:', err);
      alert('Could not update status. Please check your Firestore connection.');
    }
  };

  const filteredDeposits = deposits.filter(dep => {
    const matchesSearch = 
      dep.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.accountSender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.method.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dep.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = deposits.filter(d => d.status === 'pending').length;
  const approvedCount = deposits.filter(d => d.status === 'approved').length;

  return (
    <div className="space-y-6 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400" />
            User Coin Deposits & Payment Receipts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live real-time queue of user payment receipts submitted via JazzCash, Easypaisa, Bank, or USDT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Real-time Sync
          </span>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{pendingCount} Pending</p>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting admin receipt check</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Deposits</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{approvedCount} Approved</p>
          <p className="text-xs text-slate-500 mt-0.5">Coins credited to user wallets</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Real Receipts</span>
            <Coins className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{deposits.length} Total</p>
          <p className="text-xs text-slate-500 mt-0.5">All-time user deposit submissions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by name, email, TID, or method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to live Firestore deposits queue...</span>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-600" />
            <p className="font-bold text-white text-sm">No real deposits in this view</p>
            <p className="text-slate-500 text-[11px] max-w-sm">
              {searchQuery ? 'No results matched your search criteria.' : 'When a user deposits funds from the web app, their receipt will appear here live in real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount & Coins</th>
                  <th className="p-4">Sender Account / TID</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <p className="font-bold text-white">{dep.userName}</p>
                      <p className="text-[11px] text-slate-400">{dep.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] font-bold text-slate-200">
                        {dep.method}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-amber-300 font-mono">{dep.coinsToCredit}</p>
                      <p className="text-[10px] text-slate-400">{dep.amountUsd} ({dep.amountPkr})</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-slate-300 text-[11px] font-semibold">{dep.accountSender}</p>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {dep.timestamp}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        dep.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dep.receiptUrl && (
                          <button
                            onClick={() => setSelectedReceipt(dep)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition"
                            title="View Receipt Screenshot"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {dep.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(dep, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg font-bold transition text-[11px] border border-emerald-500/30 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(dep, 'rejected')}
                              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg font-bold transition text-[11px] border border-red-500/30 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Payment Receipt Proof</h3>
                <p className="text-[11px] text-slate-400">{selectedReceipt.userName} ({selectedReceipt.userEmail})</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <strong className="text-white font-bold">{selectedReceipt.method}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount / Coins:</span>
                <strong className="text-amber-400 font-bold">{selectedReceipt.coinsToCredit} ({selectedReceipt.amountUsd} / {selectedReceipt.amountPkr})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender / TID:</span>
                <strong className="text-emerald-400 font-mono">{selectedReceipt.accountSender}</strong>
              </div>
              {selectedReceipt.note && (
                <div className="pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
                  <strong>User Note:</strong> {selectedReceipt.note}
                </div>
              )}
            </div>

            {selectedReceipt.receiptUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72 flex items-center justify-center bg-black">
                <img 
                  src={selectedReceipt.receiptUrl} 
                  alt="Receipt Screenshot" 
                  className="object-contain max-h-72 w-full"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {selectedReceipt.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedReceipt, 'approved')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ✓ Approve & Credit Coins
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedReceipt, 'rejected')}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ✕ Reject Receipt
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
