import { useState } from 'react';
import { Rocket, ShieldCheck, Users } from 'lucide-react';

interface Campaign {
  id: string;
  appName: string;
  packageId: string;
  developerEmail: string;
  targetTesters: number;
  activeTesters: number;
  daysPassed: number;
  totalDays: number;
  budgetCoins: string;
  playStoreStatus: 'Opt-in Ready' | 'Testing in Progress' | '14-Day Completed' | 'Under Review';
  icon: string;
}

export default function Campaigns() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: 'CMP-101',
      appName: 'Fitness Tracker Pro',
      packageId: 'com.fitnesstracker.pro',
      developerEmail: 'dev.omar@gmail.com',
      targetTesters: 20,
      activeTesters: 20,
      daysPassed: 10,
      totalDays: 14,
      budgetCoins: '2,000 🪙',
      playStoreStatus: 'Testing in Progress',
      icon: '🏋️',
    },
    {
      id: 'CMP-102',
      appName: 'Language Learner AI',
      packageId: 'com.ai.languagelearner',
      developerEmail: 'sarah.tech@outlook.com',
      targetTesters: 20,
      activeTesters: 18,
      daysPassed: 2,
      totalDays: 14,
      budgetCoins: '2,500 🪙',
      playStoreStatus: 'Opt-in Ready',
      icon: '🌐',
    },
    {
      id: 'CMP-099',
      appName: 'Budget Hero Finance',
      packageId: 'com.budgethero.app',
      developerEmail: 'bilal.apps@gmail.com',
      targetTesters: 20,
      activeTesters: 20,
      daysPassed: 14,
      totalDays: 14,
      budgetCoins: '2,000 🪙',
      playStoreStatus: '14-Day Completed',
      icon: '💰',
    },
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-indigo-400" />
            Play Store Closed Testing Campaigns (20 Testers)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise 14-day closed testing compliance and tester engagement across all developer submissions.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-semibold">Google Play 2026 Compliance Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Active Closed Campaigns</p>
          <p className="text-2xl font-black text-white mt-1">2 Live Apps</p>
          <p className="text-[11px] text-blue-400 mt-1">38 Total Testers Active</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Completed 14-Day Tests</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">42 Apps</p>
          <p className="text-[11px] text-slate-400 mt-1">100% Google Play Approved</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Total Escrowed Coins</p>
          <p className="text-2xl font-black text-amber-400 mt-1">6,500 🪙</p>
          <p className="text-[11px] text-slate-400 mt-1">Held until tester completion</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Live Testing Campaigns</h2>
          <span className="text-xs text-slate-400">Target: 20 testers per app for 14 continuous days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">App & Package ID</th>
                <th className="p-4">Developer</th>
                <th className="p-4">Tester Capacity</th>
                <th className="p-4">14-Day Progress</th>
                <th className="p-4">Escrow Budget</th>
                <th className="p-4">Play Store Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow">
                        {camp.icon}
                      </div>
                      <div>
                        <p className="font-bold text-white">{camp.appName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{camp.packageId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-300 font-medium">{camp.developerEmail}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{camp.id}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>{camp.activeTesters} / {camp.targetTesters}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300 font-medium">Day {camp.daysPassed} of {camp.totalDays}</span>
                        <span className="text-slate-400">{camp.totalDays - camp.daysPassed} days left</span>
                      </div>
                      <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full" 
                          style={{ width: `${(camp.daysPassed / camp.totalDays) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-amber-300">{camp.budgetCoins}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      camp.playStoreStatus === '14-Day Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      camp.playStoreStatus === 'Testing in Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                    }`}>
                      {camp.playStoreStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition border border-slate-700">
                      Audit Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
