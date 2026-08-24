import { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, Users, AlertCircle, Smartphone } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CampaignItem {
  id: string;
  appName: string;
  packageId: string;
  developerEmail: string;
  targetTesters: number;
  activeTesters: number;
  daysPassed: number;
  totalDays: number;
  budgetCoins: number;
  playStoreStatus: string;
  icon?: string;
  createdAt?: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        const list: CampaignItem[] = snap.docs.map(doc => {
          const data = doc.data();
          const rawCoins = Number(data.costCoins || data.budgetCoins || data.coins || data.rewardCoins || 2000);
          const iconVal = data.icon || data.appIcon || data.logo || '';

          return {
            id: doc.id,
            appName: data.appName || data.name || data.title || 'Android Application',
            packageId: data.packageId || data.appId || 'com.example.app',
            developerEmail: data.developerEmail || data.userEmail || data.creatorEmail || 'developer@example.com',
            targetTesters: Number(data.targetTesters || data.testersNeeded || data.requiredTesters || 20),
            activeTesters: Number(data.activeTesters || data.testersJoined || data.joinedCount || 0),
            daysPassed: Number(data.daysPassed || 0),
            totalDays: Number(data.totalDays || data.durationDays || 14),
            budgetCoins: rawCoins,
            playStoreStatus: data.playStoreStatus || data.status || 'Active Testing',
            icon: iconVal,
          };
        });
        setCampaigns(list);
        setLoading(false);
      }, (err) => {
        console.warn('Campaigns fallback notice', err);
        const unsubFallback = onSnapshot(collection(db, 'campaigns'), (snap) => {
          const fallbackList: CampaignItem[] = snap.docs.map(doc => {
            const data = doc.data();
            const rawCoins = Number(data.costCoins || data.budgetCoins || data.coins || data.rewardCoins || 2000);
            const iconVal = data.icon || data.appIcon || data.logo || '';

            return {
              id: doc.id,
              appName: data.appName || data.name || data.title || 'Android Application',
              packageId: data.packageId || data.appId || 'com.example.app',
              developerEmail: data.developerEmail || data.userEmail || data.creatorEmail || 'developer@example.com',
              targetTesters: Number(data.targetTesters || data.testersNeeded || data.requiredTesters || 20),
              activeTesters: Number(data.activeTesters || data.testersJoined || data.joinedCount || 0),
              daysPassed: Number(data.daysPassed || 0),
              totalDays: Number(data.totalDays || data.durationDays || 14),
              budgetCoins: rawCoins,
              playStoreStatus: data.playStoreStatus || data.status || 'Active Testing',
              icon: iconVal,
            };
          });
          setCampaigns(fallbackList);
          setLoading(false);
        });
        return () => unsubFallback();
      });

      return () => unsub();
    } catch (e) {
      console.error('Campaigns listener error:', e);
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6 font-sans max-w-7xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-indigo-400" />
            Play Store Closed Testing Campaigns (20 Testers)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise real 14-day closed testing compliance across developer submissions from Cloud Firestore.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-semibold">Google Play Compliance Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Real Created Campaigns</p>
          <p className="text-2xl font-black text-white mt-1">{campaigns.length} Apps</p>
          <p className="text-[11px] text-blue-400 mt-1">Live from Firestore</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Completed 14-Day Tests</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {campaigns.filter(c => c.daysPassed >= c.totalDays).length} Apps
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for production launch</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Active In-Progress Tests</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">
            {campaigns.filter(c => c.daysPassed < c.totalDays).length} Apps
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Under daily tester tracking</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Live Developer Campaigns</h2>
          <span className="text-xs text-slate-400">Target: 20 testers for 14 continuous days</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to real campaigns collection...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-600" />
            <p className="font-bold text-white text-sm">No real campaigns created yet</p>
            <p className="text-slate-500 text-[11px] max-w-sm">
              When developers create a new test campaign on the web portal, it will display here with live tester tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 min-w-[240px]">App & Package ID</th>
                  <th className="p-4 min-w-[200px]">Developer</th>
                  <th className="p-4 min-w-[130px]">Tester Capacity</th>
                  <th className="p-4 min-w-[170px]">14-Day Progress</th>
                  <th className="p-4 min-w-[110px]">Budget</th>
                  <th className="p-4 min-w-[120px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow">
                          {camp.icon && (camp.icon.startsWith('http') || camp.icon.startsWith('data:image')) ? (
                            <img src={camp.icon} alt="" className="w-full h-full object-cover" />
                          ) : camp.icon && camp.icon.length <= 4 ? (
                            <span className="text-lg">{camp.icon}</span>
                          ) : (
                            <Smartphone className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-bold text-white truncate text-xs">{camp.appName}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{camp.packageId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="min-w-0 max-w-[200px]">
                        <p className="text-slate-300 font-medium truncate text-xs">{camp.developerEmail}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">ID: {camp.id}</p>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{camp.activeTesters} / {camp.targetTesters}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-300 font-medium whitespace-nowrap">Day {camp.daysPassed} of {camp.totalDays}</span>
                          <span className="text-slate-400 whitespace-nowrap">{Math.max(0, camp.totalDays - camp.daysPassed)} left</span>
                        </div>
                        <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (camp.daysPassed / camp.totalDays) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {camp.budgetCoins.toLocaleString()} Coins
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {camp.playStoreStatus}
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
