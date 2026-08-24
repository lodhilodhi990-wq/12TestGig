import { useState, useEffect } from 'react';
import { 
  Coins, 
  DollarSign, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Award
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Pricing() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getInitialConfig = () => {
    try {
      const saved = localStorage.getItem('admin_pricing_rates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const initial = getInitialConfig();

  // Exchange Rates
  const [coinsPerUsd, setCoinsPerUsd] = useState<number>(initial?.coinsPerUsd ?? 100);
  const [pkrPerUsd, setPkrPerUsd] = useState<number>(initial?.pkrPerUsd ?? 280);
  const [minDepositUsd, setMinDepositUsd] = useState<number>(initial?.minDepositUsd ?? 5);

  // Testing Packages
  const [base20TesterCost, setBase20TesterCost] = useState<number>(initial?.base20TesterCost ?? 200);
  const [base20Testers, setBase20Testers] = useState<number>(initial?.base20Testers ?? 20);
  const [base20Days, setBase20Days] = useState<number>(initial?.base20Days ?? 14);

  const [quickCoins, setQuickCoins] = useState<number>(initial?.quickCoins ?? 100);
  const [quickTesters, setQuickTesters] = useState<number>(initial?.quickTesters ?? 10);
  const [quickDays, setQuickDays] = useState<number>(initial?.quickDays ?? 7);
  const [quickEnabled, setQuickEnabled] = useState<boolean>(initial?.quickEnabled ?? true);

  const [proCoins, setProCoins] = useState<number>(initial?.proCoins ?? 350);
  const [proTesters, setProTesters] = useState<number>(initial?.proTesters ?? 30);
  const [proDays, setProDays] = useState<number>(initial?.proDays ?? 14);
  const [proEnabled, setProEnabled] = useState<boolean>(initial?.proEnabled ?? true);

  // Splits & Profit
  const [dailyTesterPayout, setDailyTesterPayout] = useState<number>(initial?.dailyTesterPayout ?? 100);
  const [completionBonus, setCompletionBonus] = useState<number>(initial?.completionBonus ?? 600);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(initial?.platformFeePercent ?? 20);

  // Simulator
  const [simTesters, setSimTesters] = useState(20);
  const [simDays, setSimDays] = useState(14);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform_settings', 'pricing_rates'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.coinsPerUsd !== undefined) setCoinsPerUsd(Number(d.coinsPerUsd));
          if (d.pkrPerUsd !== undefined) setPkrPerUsd(Number(d.pkrPerUsd));
          if (d.minDepositUsd !== undefined) setMinDepositUsd(Number(d.minDepositUsd));
          if (d.base20TesterCost !== undefined) setBase20TesterCost(Number(d.base20TesterCost));
          if (d.base20Testers !== undefined) setBase20Testers(Number(d.base20Testers));
          if (d.base20Days !== undefined) setBase20Days(Number(d.base20Days));
          if (d.quickCoins !== undefined) setQuickCoins(Number(d.quickCoins));
          if (d.quickTesters !== undefined) setQuickTesters(Number(d.quickTesters));
          if (d.quickDays !== undefined) setQuickDays(Number(d.quickDays));
          if (d.quickEnabled !== undefined) setQuickEnabled(Boolean(d.quickEnabled));
          if (d.proCoins !== undefined) setProCoins(Number(d.proCoins));
          if (d.proTesters !== undefined) setProTesters(Number(d.proTesters));
          if (d.proDays !== undefined) setProDays(Number(d.proDays));
          if (d.proEnabled !== undefined) setProEnabled(Boolean(d.proEnabled));
          if (d.dailyTesterPayout !== undefined) setDailyTesterPayout(Number(d.dailyTesterPayout));
          if (d.completionBonus !== undefined) setCompletionBonus(Number(d.completionBonus));
          if (d.platformFeePercent !== undefined) setPlatformFeePercent(Number(d.platformFeePercent));
        }
      } catch (err) {
        console.warn('Firestore load notice:', err);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      coinsPerUsd: Number(coinsPerUsd),
      pkrPerUsd: Number(pkrPerUsd),
      oneCoinUsd: 1 / Number(coinsPerUsd),
      oneCoinPkr: Number(pkrPerUsd) / Number(coinsPerUsd),
      minDepositUsd: Number(minDepositUsd),

      base20TesterCost: Number(base20TesterCost),
      base20Testers: Number(base20Testers),
      base20Days: Number(base20Days),

      quickCoins: Number(quickCoins),
      quickTesters: Number(quickTesters),
      quickDays: Number(quickDays),
      quickEnabled: Boolean(quickEnabled),

      proCoins: Number(proCoins),
      proTesters: Number(proTesters),
      proDays: Number(proDays),
      proEnabled: Boolean(proEnabled),

      dailyTesterPayout: Number(dailyTesterPayout),
      completionBonus: Number(completionBonus),
      platformFeePercent: Number(platformFeePercent),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('admin_pricing_rates', JSON.stringify({ ...initial, ...payload }));
      await setDoc(doc(db, 'platform_settings', 'pricing_rates'), payload, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('Save error:', e);
      alert('Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const simTotalCost = Math.round((simTesters * simDays * (base20TesterCost / (base20Testers * base20Days))));
  const simTotalUsd = (simTotalCost / coinsPerUsd).toFixed(2);
  const simTotalPkr = Math.round((simTotalCost / coinsPerUsd) * pkrPerUsd);
  const simPlatformProfitUsd = ((simTotalCost / coinsPerUsd) * (platformFeePercent / 100)).toFixed(2);

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400" />
            Coin Economics & Package Pricing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure exchange rates, package coin costs, tester payouts, and simulator projections.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Pricing Rates'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Pricing rates and package costs updated and synced with user apps!
        </div>
      )}

      {/* 1. MASTER CURRENCY EXCHANGE RATES */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Currency & Coin Conversion Rates
          </h2>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Global Sync
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Coins per 1 USD ($)</label>
            <div className="relative">
              <input 
                type="number" value={coinsPerUsd} min={1}
                onChange={(e) => setCoinsPerUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">1 Coin = ${(1 / coinsPerUsd).toFixed(3)} USD</p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">1 USD to PKR Exchange Rate</label>
            <div className="relative">
              <input 
                type="number" value={pkrPerUsd} min={1}
                onChange={(e) => setPkrPerUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">PKR</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">1 Coin = Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Minimum Deposit Limit ($ USD)</label>
            <div className="relative">
              <input 
                type="number" value={minDepositUsd} min={1}
                onChange={(e) => setMinDepositUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">USD</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{minDepositUsd * coinsPerUsd} Coins minimum</p>
          </div>
        </div>
      </div>

      {/* 2. THREE TESTING PACKAGES */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400" /> Google Play Testing Packages (Shown in Builder)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* PACKAGE 1 */}
          <div className="bg-[#0f172a] rounded-2xl border border-blue-500/40 p-5 shadow-lg shadow-blue-500/5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Play Console Standard
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Mandatory Active</span>
            </div>
            <h3 className="text-sm font-black text-white">Google Play Official 20-Tester Track</h3>
            <p className="text-[11px] text-slate-400 mt-1">Meets Google's 20 testers for 14 continuous days rule.</p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                <input 
                  type="number" value={base20TesterCost}
                  onChange={(e) => setBase20TesterCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  = ${(base20TesterCost / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((base20TesterCost / coinsPerUsd) * pkrPerUsd)} PKR)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                  <input 
                    type="number" value={base20Testers}
                    onChange={(e) => setBase20Testers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                  <input 
                    type="number" value={base20Days}
                    onChange={(e) => setBase20Days(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE 2 */}
          <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${quickEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Fast Turnaround
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" checked={quickEnabled} 
                  onChange={(e) => setQuickEnabled(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
            <h3 className="text-sm font-black text-white">Quick Quality Audit</h3>
            <p className="text-[11px] text-slate-400 mt-1">Lightweight 10 testers for 7 days bug sweep.</p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                <input 
                  type="number" value={quickCoins}
                  onChange={(e) => setQuickCoins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  = ${(quickCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((quickCoins / coinsPerUsd) * pkrPerUsd)} PKR)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                  <input 
                    type="number" value={quickTesters}
                    onChange={(e) => setQuickTesters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                  <input 
                    type="number" value={quickDays}
                    onChange={(e) => setQuickDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE 3 */}
          <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${proEnabled ? 'border-purple-500/40 shadow-lg shadow-purple-500/5' : 'border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Enterprise
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" checked={proEnabled} 
                  onChange={(e) => setProEnabled(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <h3 className="text-sm font-black text-white">Enterprise Studio Coverage</h3>
            <p className="text-[11px] text-slate-400 mt-1">Extensive 30 testers for 14 full days.</p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                <input 
                  type="number" value={proCoins}
                  onChange={(e) => setProCoins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  = ${(proCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((proCoins / coinsPerUsd) * pkrPerUsd)} PKR)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                  <input 
                    type="number" value={proTesters}
                    onChange={(e) => setProTesters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                  <input 
                    type="number" value={proDays}
                    onChange={(e) => setProDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMULATOR */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-indigo-500/20">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <RefreshCw className="w-4 h-4 text-indigo-400" /> Live Campaign Cost & Profit Simulator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                <span>Testers Count:</span>
                <span className="text-indigo-400 font-black">{simTesters} Testers</span>
              </div>
              <input 
                type="range" min={10} max={50} step={5} value={simTesters}
                onChange={(e) => setSimTesters(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                <span>Duration (Days):</span>
                <span className="text-indigo-400 font-black">{simDays} Days</span>
              </div>
              <input 
                type="range" min={7} max={30} step={7} value={simDays}
                onChange={(e) => setSimDays(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Charged to Customer</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{simTotalCost.toLocaleString()} Coins</span>
            </div>
            <p className="text-xs text-emerald-400 font-bold mt-1">≈ ${simTotalUsd} USD (Rs {simTotalPkr.toLocaleString()} PKR)</p>
          </div>

          <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20 flex flex-col justify-center">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Platform Net Profit ({platformFeePercent}%)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400">${simPlatformProfitUsd} USD</span>
            </div>
            <p className="text-xs text-indigo-300 font-medium mt-1">Direct Profit per this campaign</p>
          </div>
        </div>
      </div>
    </div>
  );
}
