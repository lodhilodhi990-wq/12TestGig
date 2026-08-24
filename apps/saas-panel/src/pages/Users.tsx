import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  AlertCircle, 
  Coins, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserItem {
  id: string;
  name: string;
  email: string;
  coinsBalance: number;
  activeTests?: number;
  trustScore?: number;
  status: string;
  createdAt?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit coins modal state
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [coinAdjustmentAmount, setCoinAdjustmentAmount] = useState<number>(100);
  const [adjustmentAction, setAdjustmentAction] = useState<'add' | 'deduct'>('add');
  const [adjustmentReason, setAdjustmentReason] = useState('Manual Admin Credit');
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'users'), (snap) => {
        const list: UserItem[] = snap.docs.map(d => {
          const data = d.data();
          let createdFormatted = 'Recent';
          if (data.createdAt?.toDate) {
            createdFormatted = data.createdAt.toDate().toLocaleDateString();
          } else if (data.createdAt) {
            createdFormatted = new Date(data.createdAt).toLocaleDateString();
          }

          const balance = data.coinsBalance !== undefined ? Number(data.coinsBalance) :
                          data.coins !== undefined ? Number(data.coins) : 0;

          return {
            id: d.id,
            name: data.displayName || data.name || data.fullName || 'User',
            email: data.email || 'user@example.com',
            coinsBalance: balance,
            activeTests: data.activeTests || 0,
            trustScore: data.trustScore ?? 100,
            status: data.status || 'active',
            createdAt: createdFormatted,
          };
        });
        setUsers(list);
        setLoading(false);
      }, (err) => {
        console.warn('Users listener notice', err);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Users listener catch:', e);
      setLoading(false);
    }
  }, []);

  const handleAdjustCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsUpdatingBalance(true);

    const delta = adjustmentAction === 'add' ? coinAdjustmentAmount : -coinAdjustmentAmount;
    const newBalance = Math.max(0, (selectedUser.coinsBalance || 0) + delta);

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        coinsBalance: newBalance,
        coins: newBalance,
        updatedAt: new Date().toISOString()
      });

      // Also check wallets collection for sync
      try {
        const walletRef = doc(db, 'wallets', selectedUser.id);
        const wSnap = await getDoc(walletRef);
        if (wSnap.exists()) {
          await updateDoc(walletRef, {
            balance: newBalance,
            coins: newBalance,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Wallet doc update optional notice', err);
      }

      setActionSuccessMsg(`Successfully ${adjustmentAction === 'add' ? 'added' : 'deducted'} ${coinAdjustmentAmount} Coins for ${selectedUser.name}!`);
      setTimeout(() => {
        setActionSuccessMsg(null);
        setSelectedUser(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to update user coins:', err);
      alert('Could not update coins. Please check connection.');
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const handleToggleStatus = async (userItem: UserItem) => {
    const newStatus = userItem.status === 'active' ? 'suspended' : 'active';
    try {
      const userRef = doc(db, 'users', userItem.id);
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalCirculatingCoins = users.reduce((sum, u) => sum + (u.coinsBalance || 0), 0);

  return (
    <div className="space-y-6 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <UsersIcon className="w-6 h-6 text-blue-400" />
            Platform Registered Users & Balances
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time registered unified user accounts, live coin balances, and account management from Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {users.length} Real Users Registered
          </span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered Users</span>
          <p className="text-2xl font-black text-white mt-1">{users.length} Accounts</p>
          <p className="text-xs text-blue-400 mt-0.5">All-in-one Unified User Portal</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total User Coins in Circulation</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{totalCirculatingCoins.toLocaleString()} 🪙</p>
          <p className="text-xs text-slate-500 mt-0.5">≈ ${(totalCirculatingCoins / 100).toFixed(2)} USD</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Platform Status</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {users.filter(u => u.status === 'active').length} Active
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Verified & In Good Standing</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">
          Showing {filteredUsers.length} of {users.length} Users
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to real Firestore users list...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-600" />
            <p className="font-bold text-white text-sm">No real users found</p>
            <p className="text-slate-500 text-[11px] max-w-sm">
              {searchQuery ? 'No users matched your search criteria.' : 'When users register on the web app, their real accounts and coin balances will display here live.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Live Coin Balance</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      <p className="text-[9px] text-slate-600 font-mono mt-0.5">UID: {u.id}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-300 text-sm">
                          {(u.coinsBalance || 0).toLocaleString()} 🪙
                        </span>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setCoinAdjustmentAmount(100);
                            setAdjustmentAction('add');
                          }}
                          className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg border border-amber-500/30 text-[10px] flex items-center gap-1 transition cursor-pointer"
                          title="Add or Deduct Coins"
                        >
                          <Coins className="w-3 h-3" /> ± Edit Coins
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {(u.trustScore ?? 100) >= 80 ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                        )}
                        <span className={`font-bold ${(u.trustScore ?? 100) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {u.trustScore ?? 100}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {u.createdAt}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        u.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition border ${
                            u.status === 'active' 
                              ? 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border-red-500/30' 
                              : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust User Coins Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  Adjust Coin Balance
                </h3>
                <p className="text-[11px] text-slate-400">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            {actionSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {actionSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAdjustCoins} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-medium">Current Live Balance:</span>
                <span className="text-base font-black text-amber-400 font-mono">{selectedUser.coinsBalance.toLocaleString()} Coins</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentAction('add')}
                  className={`py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border ${
                    adjustmentAction === 'add'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Add Coins
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentAction('deduct')}
                  className={`py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border ${
                    adjustmentAction === 'deduct'
                      ? 'bg-red-600 text-white border-red-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" /> - Deduct Coins
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Coins Amount:</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={coinAdjustmentAmount}
                    onChange={(e) => setCoinAdjustmentAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-black text-sm outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Coins</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Reason / Admin Note:</label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. Deposit manual top-up, bonus, correction"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingBalance}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdatingBalance ? 'Saving...' : `Confirm ${adjustmentAction === 'add' ? '+' : '-'}${coinAdjustmentAmount} Coins`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
