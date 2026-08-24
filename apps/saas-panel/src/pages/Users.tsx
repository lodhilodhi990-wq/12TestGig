import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Users as UsersIcon, Search, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  coinsBalance?: number;
  activeTests?: number;
  trustScore?: number;
  status: string;
  createdAt?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'tester' | 'earner'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        const list: UserItem[] = snap.docs.map(doc => {
          const data = doc.data();
          let createdFormatted = 'N/A';
          if (data.createdAt?.toDate) {
            createdFormatted = data.createdAt.toDate().toLocaleDateString();
          } else if (data.createdAt) {
            createdFormatted = new Date(data.createdAt).toLocaleDateString();
          }

          return {
            id: doc.id,
            name: data.displayName || data.name || 'User',
            email: data.email || 'user@example.com',
            role: data.role || 'customer',
            coinsBalance: data.coinsBalance || data.coins || 0,
            activeTests: data.activeTests || 0,
            trustScore: data.trustScore ?? 100,
            status: data.status || 'active',
            createdAt: createdFormatted,
          };
        });
        setUsers(list);
        setLoading(false);
      }, (err) => {
        console.warn('Firestore users fallback notice', err);
        // Fallback without ordering in case index is pending
        const unsubFallback = onSnapshot(collection(db, 'users'), (snap) => {
          const fallbackList: UserItem[] = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.displayName || data.name || 'User',
              email: data.email || 'user@example.com',
              role: data.role || 'customer',
              coinsBalance: data.coinsBalance || data.coins || 0,
              activeTests: data.activeTests || 0,
              trustScore: data.trustScore ?? 100,
              status: data.status || 'active',
              createdAt: 'Recent',
            };
          });
          setUsers(fallbackList);
          setLoading(false);
        });
        return () => unsubFallback();
      });

      return () => unsub();
    } catch (e) {
      console.error('Users listener error:', e);
      setLoading(false);
    }
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <UsersIcon className="w-6 h-6 text-blue-400" />
            Platform Registered Users & Roles
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time registered testers, developers, and earners from Cloud Firestore.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {users.length} Real Users Registered
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'customer', 'tester', 'earner'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                roleFilter === role
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role === 'all' ? 'All Roles' : `${role}s`}
            </button>
          ))}
        </div>
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
              {searchQuery ? 'No users matched your search criteria.' : 'When developers or testers register on the web app, their real accounts will display here automatically.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Coin Balance</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-mono font-bold text-amber-300">{(u.coinsBalance || 0).toLocaleString()} 🪙</p>
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
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
