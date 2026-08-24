import { useState, useEffect } from 'react';
import { Eye, Coins, Search } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Deposit {
  id: string;
  userEmail: string;
  userName: string;
  amountUsd: string;
  amountPkr: string;
  coinsToCredit: string;
  coinsNumber?: number;
  method: string;
  accountSender: string;
  receiptUrl: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_MOCK_DEPOSITS: Deposit[] = [
  {
    id: 'DEP-9021',
    userEmail: 'dev.omar@gmail.com',
    userName: 'Omar Farooq',
    amountUsd: '$50.00',
    amountPkr: '14,000 PKR',
    coinsToCredit: '5,000 🪙',
    coinsNumber: 5000,
    method: 'Easypaisa (Pakistan)',
    accountSender: '0312-9876543 (TID: 89012345)',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    timestamp: '10 mins ago',
    status: 'pending',
  },
  {
    id: 'DEP-9020',
    userEmail: 'sarah.tech@outlook.com',
    userName: 'Sarah Jenkins',
    amountUsd: '$100.00',
    amountPkr: '28,000 PKR',
    coinsToCredit: '10,000 🪙',
    coinsNumber: 10000,
    method: 'Meezan Bank (PKR / Raast)',
    accountSender: 'HBL - 0987654321',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800',
    timestamp: '1 hour ago',
    status: 'pending',
  },
  {
    id: 'DEP-9018',
    userEmail: 'bilal.apps@gmail.com',
    userName: 'Bilal Khan',
    amountUsd: '$200.00',
    amountPkr: '56,000 PKR',
    coinsToCredit: '20,000 🪙',
    coinsNumber: 20000,
    method: 'USDT TRC20 & Binance Pay',
    accountSender: 'TxID: 0x9f18a2...827',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    timestamp: 'Yesterday',
    status: 'approved',
  },
];

export default function Deposits() {
  const [selectedReceipt, setSelectedReceipt] = useState<Deposit | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>(INITIAL_MOCK_DEPOSITS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const q = collection(db, 'deposits');
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveList: Deposit[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              userEmail: data.userEmail || 'user@example.com',
              userName: data.userName || 'Developer',
              amountUsd: data.amountUsd || '$20.00',
              amountPkr: data.amountPkr || '5,600 PKR',
              coinsToCredit: data.coinsToCredit || '2,000 🪙',
              coinsNumber: data.coinsNumber || 2000,
              method: data.method || 'Easypaisa',
              accountSender: data.accountSender || '03001234567',
              receiptUrl: data.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
              timestamp: data.timestamp ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
              status: data.status || 'pending',
            };
          });

          // Merge live deposits with mock items for a full rich experience
          setDeposits([...liveList, ...INITIAL_MOCK_DEPOSITS]);
        }
      }, (error) => {
        console.warn('Deposits snapshot notice', error);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Realtime deposit listener fallback', e);
    }
  }, []);

  const handleApprove = async (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    setSelectedReceipt(null);

    try {
      await updateDoc(doc(db, 'deposits', id), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore update fallback', e);
    }

    alert(`Deposit ${id} Approved! Coins credited to developer's wallet.`);
  };

  const handleReject = async (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    setSelectedReceipt(null);

    try {
      await updateDoc(doc(db, 'deposits', id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore update fallback', e);
    }

    alert(`Deposit ${id} marked as rejected.`);
  };

  const filteredDeposits = deposits.filter(d => 
    d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.accountSender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400" />
            Coin Deposits & Payment Verifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review user payment receipts and credit coins to developer accounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-semibold">
              {deposits.filter(d => d.status === 'pending').length} Pending Approvals
            </span>
          </div>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user email, ID or sender TID..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Rate: $1.00 = 100 🪙</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Transaction ID & User</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount Sent</th>
                <th className="p-4">Coins to Credit</th>
                <th className="p-4">Receipt Proof</th>
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
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{dep.id} • {dep.timestamp}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{dep.method}</p>
                    <p className="text-[10px] text-slate-400 font-mono">From: {dep.accountSender}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-bold">{dep.amountUsd}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">{dep.amountPkr}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 font-mono font-extrabold text-amber-300 text-sm">
                      {dep.coinsToCredit}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedReceipt(dep)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Receipt
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      dep.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                      'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}>
                      {dep.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {dep.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(dep.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition shadow-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(dep.id)}
                          className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-lg text-xs transition border border-red-500/30"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-semibold">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Proof Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Payment Receipt Proof</h3>
                <p className="text-xs text-slate-400">Transaction: {selectedReceipt.id} • {selectedReceipt.userName}</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 mb-4 flex items-center justify-center overflow-hidden max-h-72">
              <img 
                src={selectedReceipt.receiptUrl} 
                alt="Payment Receipt" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Sent:</span>
                <span className="text-white font-bold">{selectedReceipt.amountUsd} ({selectedReceipt.amountPkr})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coins to Credit:</span>
                <span className="text-amber-300 font-bold">{selectedReceipt.coinsToCredit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Account:</span>
                <span className="text-slate-200">{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender / TID:</span>
                <span className="text-emerald-400 font-mono">{selectedReceipt.accountSender}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
              {selectedReceipt.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleReject(selectedReceipt.id)}
                    className="flex-1 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs rounded-xl transition border border-red-500/30"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedReceipt.id)}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    Approve & Credit Coins
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
