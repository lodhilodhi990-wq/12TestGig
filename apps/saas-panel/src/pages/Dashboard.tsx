import { useState, useEffect } from 'react';
import { 
  Coins, 
  Users, 
  Rocket, 
  Clock, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Deposit } from './Deposits';

export default function Dashboard() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [campaignsCount, setCampaignsCount] = useState<number>(0);
  const [totalRevenueUsd, setTotalRevenueUsd] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Real-time deposits listener
    const qDep = query(collection(db, 'deposits'), orderBy('createdAt', 'desc'), limit(10));
    const unsubDep = onSnapshot(qDep, (snapshot) => {
      const liveList: Deposit[] = snapshot.docs.map(doc => {
        const data = doc.data();
        let formattedTime = 'Just now';
        if (data.createdAt?.toDate) {
          formattedTime = data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (data.timestamp) {
          formattedTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          timestamp: formattedTime,
          status: data.status || 'pending',
        };
      });

      setDeposits(liveList);

      // Compute total approved deposit revenue
      let sum = 0;
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (data.status === 'approved' && data.amountUsd) {
          const num = parseFloat(String(data.amountUsd).replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) sum += num;
        }
      });
      setTotalRevenueUsd(sum);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    // 2. Real-time users count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsersCount(snap.size);
    }, () => {});

    // 3. Real-time campaigns count
    const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snap) => {
      setCampaignsCount(snap.size);
    }, () => {});

    return () => {
      unsubDep();
      unsubUsers();
      unsubCampaigns();
    };
  }, []);

  const pendingDeposits = deposits.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Command Center
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Connected
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time metrics, live user deposits, and financial activity from Firebase.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/deposits" 
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Coins className="w-3.5 h-3.5" /> Review Deposits ({pendingDeposits.length})
          </Link>
          <Link 
            to="/settings" 
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            Payment Settings
          </Link>
        </div>
      </div>

      {/* KPI Cards (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Approved Revenue</p>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-emerald-400 mt-2">${totalRevenueUsd.toFixed(2)} USD</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>From real user deposits</span>
            <span className="font-bold text-slate-300">Live</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Deposits</p>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-amber-400 mt-2">{pendingDeposits.length} Receipts</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Needs verification</span>
            <Link to="/deposits" className="font-bold text-blue-400 hover:text-blue-300">Review &rarr;</Link>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Users</p>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-white mt-2">{usersCount} Users</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Testers & Customers</span>
            <Link to="/users" className="font-bold text-blue-400 hover:text-blue-300">Manage &rarr;</Link>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Testing Campaigns</p>
              <Rocket className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-indigo-400 mt-2">{campaignsCount} Apps</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Active Closed Tests</span>
            <Link to="/campaigns" className="font-bold text-indigo-400 hover:text-indigo-300">View &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Live Recent Deposit Receipts */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Live User Deposit Queue (Real Data)</h2>
          </div>
          <Link to="/deposits" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Open Full Deposits Desk <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Connecting to live Firestore stream...
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-400">No deposit receipts received yet</p>
            <p className="text-[11px]">When a customer or tester submits payment proof from the web app, it will appear here instantly in real-time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 p-2 flex-1">
            {deposits.map((dep) => (
              <div key={dep.id} className="p-3 rounded-xl hover:bg-slate-800/40 transition flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-white">{dep.userName}</p>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                      dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      dep.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-300'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dep.userEmail} • {dep.method} (Sender: {dep.accountSender})</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-xs text-amber-300">{dep.coinsToCredit}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{dep.amountUsd} ({dep.amountPkr})</p>
                  </div>
                  <Link 
                    to="/deposits"
                    className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-bold rounded-lg transition border border-blue-500/30"
                  >
                    {dep.status === 'pending' ? 'Verify' : 'Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
