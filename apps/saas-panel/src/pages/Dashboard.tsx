import { 
  Coins, 
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue (Deposits)', value: '$12,450.00', change: '+18.2%', isPositive: true, sub: '≈ PKR 3.48M' },
    { title: 'Active Circulating Coins', value: '1,245,000 🪙', change: '+24.5%', isPositive: true, sub: 'Backed by Reserve' },
    { title: 'Live 14-Day Campaigns', value: '42 Apps', change: '+8 this week', isPositive: true, sub: '840 Active Testers' },
    { title: 'Flagged Scammers / Risk', value: '3 Users', change: '2 Banned Today', isPositive: false, sub: 'Trust Score < 30%' },
  ];

  const recentDeposits = [
    { id: 'DEP-9021', user: 'Omar Farooq', amount: '$50.00', coins: '5,000 🪙', method: 'Easypaisa', status: 'Pending Review' },
    { id: 'DEP-9020', user: 'Sarah Jenkins', amount: '$100.00', coins: '10,000 🪙', method: 'Meezan Bank', status: 'Pending Review' },
  ];

  const flaggedAccounts = [
    { id: 'usr_3', name: 'ScammerX', email: 'bot22@tempmail.com', reason: 'Claimed 25 tests in 2 minutes', trustScore: 12 },
    { id: 'usr_9', name: 'FakeTester_09', email: 'fastclick@proton.me', reason: 'VPN & Multi-account detection', trustScore: 24 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Platform Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time metrics, fraud detection, and financial overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/deposits" 
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Coins className="w-3.5 h-3.5" /> Review Deposits (2)
          </Link>
          <Link 
            to="/users" 
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Scam Radar
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
              <span className="text-slate-500 font-medium text-[11px]">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Queue: Pending Deposits & Anti-Scam Alert Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pending Coin Deposits */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Pending Coin Deposits (Receipts)</h2>
            </div>
            <Link to="/deposits" className="text-xs font-bold text-blue-400 hover:text-blue-300">
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 p-2 flex-1">
            {recentDeposits.map((dep) => (
              <div key={dep.id} className="p-3 rounded-xl hover:bg-slate-800/40 transition flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-white">{dep.user}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dep.id} • {dep.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-xs text-amber-300">{dep.coins}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{dep.amount}</p>
                  </div>
                  <Link 
                    to="/deposits"
                    className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-bold rounded-lg transition border border-blue-500/30"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Anti-Scam Radar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-bold text-white">Anti-Scam AI Risk Monitor</h2>
            </div>
            <Link to="/users" className="text-xs font-bold text-red-400 hover:text-red-300">
              User Risk Table &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 p-2 flex-1">
            {flaggedAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded-xl bg-red-950/10 hover:bg-red-950/20 transition flex items-center justify-between border border-red-900/20 my-1">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-white">{acc.name}</p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      Trust: {acc.trustScore}%
                    </span>
                  </div>
                  <p className="text-[10px] text-red-300/80 mt-0.5">{acc.reason}</p>
                </div>
                <button 
                  onClick={() => alert(`Account ${acc.name} banned!`)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded-lg transition shadow"
                >
                  Ban User
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
