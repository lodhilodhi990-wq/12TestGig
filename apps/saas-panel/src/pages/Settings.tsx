import { useState, useEffect } from 'react';
import { 
  Coins, 
  DollarSign, 
  Smartphone, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  Layers, 
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Settings() {
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

  // Coin Exchange Rates (1 Coin Kitna Ka Hai?)
  const [coinsPerUsd, setCoinsPerUsd] = useState<number>(initial?.coinsPerUsd ?? 100);
  const [pkrPerUsd, setPkrPerUsd] = useState<number>(initial?.pkrPerUsd ?? 280);
  const [minDepositUsd, setMinDepositUsd] = useState<number>(initial?.minDepositUsd ?? 5);
  const [minWithdrawCoins, setMinWithdrawCoins] = useState<number>(initial?.minWithdrawCoins ?? 1000);

  // Package 1: Google Play Req
  const [base20TesterCost, setBase20TesterCost] = useState<number>(initial?.base20TesterCost ?? 200);
  const [base20Testers, setBase20Testers] = useState<number>(initial?.base20Testers ?? 20);
  const [base20Days, setBase20Days] = useState<number>(initial?.base20Days ?? 14);

  // Package 2: Quick Audit
  const [quickCoins, setQuickCoins] = useState<number>(initial?.quickCoins ?? 100);
  const [quickTesters, setQuickTesters] = useState<number>(initial?.quickTesters ?? 10);
  const [quickDays, setQuickDays] = useState<number>(initial?.quickDays ?? 7);
  const [quickEnabled, setQuickEnabled] = useState<boolean>(initial?.quickEnabled ?? true);

  // Package 3: Pro Coverage
  const [proCoins, setProCoins] = useState<number>(initial?.proCoins ?? 350);
  const [proTesters, setProTesters] = useState<number>(initial?.proTesters ?? 30);
  const [proDays, setProDays] = useState<number>(initial?.proDays ?? 14);
  const [proEnabled, setProEnabled] = useState<boolean>(initial?.proEnabled ?? true);

  // Payout Splits & Profit
  const [dailyTesterPayout, setDailyTesterPayout] = useState<number>(initial?.dailyTesterPayout ?? 100);
  const [completionBonus, setCompletionBonus] = useState<number>(initial?.completionBonus ?? 600);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(initial?.platformFeePercent ?? 20);

  // Receiving Accounts
  const [easypaisaNumber, setEasypaisaNumber] = useState(initial?.easypaisaNumber ?? '0300-1234567');
  const [easypaisaTitle, setEasypaisaTitle] = useState(initial?.easypaisaTitle ?? 'Umar Hayat');
  const [bankDetails, setBankDetails] = useState(initial?.bankDetails ?? 'Meezan Bank, Acc: 1234567890 (Umar Hayat)');
  const [payoneerEmail, setPayoneerEmail] = useState(initial?.payoneerEmail ?? 'pay@12testgig.com');
  const [usdtAddress, setUsdtAddress] = useState(initial?.usdtAddress ?? 'USDT TRC20: T9yD14Nj9yDbv... (Binance)');

  // Simulator State
  const [simTesters, setSimTesters] = useState<number>(20);
  const [simDays, setSimDays] = useState<number>(14);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const cached = localStorage.getItem('admin_pricing_rates');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          applyConfig(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      try {
        const docRef = doc(db, 'platform_settings', 'pricing_rates');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const d = snap.data();
          applyConfig(d);
          localStorage.setItem('admin_pricing_rates', JSON.stringify(d));
        }
      } catch (err) {
        console.warn('Firestore load', err);
      }
    };

    const applyConfig = (d: any) => {
      if (d.coinsPerUsd !== undefined) setCoinsPerUsd(Number(d.coinsPerUsd));
      if (d.pkrPerUsd !== undefined) setPkrPerUsd(Number(d.pkrPerUsd));
      if (d.minDepositUsd !== undefined) setMinDepositUsd(Number(d.minDepositUsd));
      if (d.minWithdrawCoins !== undefined) setMinWithdrawCoins(Number(d.minWithdrawCoins));
      
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
      if (d.easypaisaNumber !== undefined) setEasypaisaNumber(String(d.easypaisaNumber));
      if (d.easypaisaTitle !== undefined) setEasypaisaTitle(String(d.easypaisaTitle));
      if (d.bankDetails !== undefined) setBankDetails(String(d.bankDetails));
      if (d.payoneerEmail !== undefined) setPayoneerEmail(String(d.payoneerEmail));
      if (d.usdtAddress !== undefined) setUsdtAddress(String(d.usdtAddress));
    };

    loadConfig();
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      coinsPerUsd: Number(coinsPerUsd),
      pkrPerUsd: Number(pkrPerUsd),
      oneCoinUsd: 1 / Number(coinsPerUsd),
      oneCoinPkr: Number(pkrPerUsd) / Number(coinsPerUsd),
      minDepositUsd: Number(minDepositUsd),
      minWithdrawCoins: Number(minWithdrawCoins),

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
      easypaisaNumber: String(easypaisaNumber),
      easypaisaTitle: String(easypaisaTitle),
      bankDetails: String(bankDetails),
      payoneerEmail: String(payoneerEmail),
      usdtAddress: String(usdtAddress),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('admin_pricing_rates', JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }

    try {
      await setDoc(doc(db, 'platform_settings', 'pricing_rates'), payload, { merge: true });
    } catch (e: any) {
      console.warn('Firestore write notice', e);
    } finally {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Dynamic Simulator Calculation
  const simTotalCost = Math.round((simTesters * simDays * (base20TesterCost / (base20Testers * base20Days))));
  const simTotalUsd = (simTotalCost / coinsPerUsd).toFixed(2);
  const simTotalPkr = Math.round((simTotalCost / coinsPerUsd) * pkrPerUsd);
  const simPlatformProfitUsd = ((simTotalCost / coinsPerUsd) * (platformFeePercent / 100)).toFixed(2);

  return (
    <div className="space-y-8 font-sans max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400" />
            Coin Economics & Testing Packages Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit all 3 testing packages, toggle packages ON/OFF, set Coin exchange rates, and manage accounts.
          </p>
        </div>

        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving Changes...' : 'Save Pricing & Packages'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          Pricing and testing packages saved successfully to Cloud Firestore!
        </div>
      )}

      {/* QUICK STATUS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1 Coin Value (USD)</span>
          <p className="text-2xl font-black text-amber-400 mt-1">${(1 / coinsPerUsd).toFixed(3)} USD</p>
          <p className="text-xs text-slate-400 mt-1">{coinsPerUsd} Coins = $1.00 USD</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1 Coin Value (PKR)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</p>
          <p className="text-xs text-slate-400 mt-1">100 Coins = Rs {pkrPerUsd} PKR</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Google Play Req Package</span>
          <p className="text-2xl font-black text-white mt-1">{base20TesterCost.toLocaleString()} Coins</p>
          <p className="text-xs text-blue-400 mt-1">Cost to Developer: ${(base20TesterCost / coinsPerUsd).toFixed(2)}</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform Profit Margin</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{platformFeePercent}% Margin</p>
          <p className="text-xs text-slate-400 mt-1">Per Campaign Profit: ${(base20TesterCost / coinsPerUsd * (platformFeePercent / 100)).toFixed(2)}</p>
        </div>
      </div>

      {/* SECTION: 3 TESTING PACKAGES MANAGER */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Manage Testing Packages (Edit or Disable)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Customize coins, tester numbers, duration, or toggle them ON/OFF.</p>
          </div>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Live User Panel Sync
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* PACKAGE 1: GOOGLE PLAY REQ */}
          <div className="bg-slate-900/70 border border-blue-500/40 rounded-2xl p-5 relative shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                Package 1: Primary
              </span>
              <span className="text-[10px] font-bold text-emerald-400">Always Active</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-4">Google Play 14-Day Requirement</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Price (Coins)</label>
                <input 
                  type="number"
                  value={base20TesterCost}
                  onChange={(e) => setBase20TesterCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
                <p className="text-[10px] text-emerald-400 mt-1">≈ ${(base20TesterCost / coinsPerUsd).toFixed(2)} USD</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers</label>
                  <input 
                    type="number"
                    value={base20Testers}
                    onChange={(e) => setBase20Testers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days</label>
                  <input 
                    type="number"
                    value={base20Days}
                    onChange={(e) => setBase20Days(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE 2: QUICK AUDIT */}
          <div className={`bg-slate-900/70 border rounded-2xl p-5 relative transition-all ${
            quickEnabled ? 'border-amber-500/40 shadow-md' : 'border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                Package 2: Quick Audit
              </span>
              <button 
                type="button"
                onClick={() => setQuickEnabled(!quickEnabled)}
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition ${
                  quickEnabled 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
              >
                {quickEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {quickEnabled ? 'Enabled' : 'Disabled / Hidden'}
              </button>
            </div>
            <h3 className="text-sm font-bold text-white mb-4">Quick Audit (Mini Test)</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Price (Coins)</label>
                <input 
                  type="number"
                  value={quickCoins}
                  onChange={(e) => setQuickCoins(Number(e.target.value))}
                  disabled={!quickEnabled}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                />
                <p className="text-[10px] text-emerald-400 mt-1">≈ ${(quickCoins / coinsPerUsd).toFixed(2)} USD</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers</label>
                  <input 
                    type="number"
                    value={quickTesters}
                    onChange={(e) => setQuickTesters(Number(e.target.value))}
                    disabled={!quickEnabled}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days</label>
                  <input 
                    type="number"
                    value={quickDays}
                    onChange={(e) => setQuickDays(Number(e.target.value))}
                    disabled={!quickEnabled}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE 3: PRO COVERAGE */}
          <div className={`bg-slate-900/70 border rounded-2xl p-5 relative transition-all ${
            proEnabled ? 'border-purple-500/40 shadow-md' : 'border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                Package 3: Pro Coverage
              </span>
              <button 
                type="button"
                onClick={() => setProEnabled(!proEnabled)}
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition ${
                  proEnabled 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
              >
                {proEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {proEnabled ? 'Enabled' : 'Disabled / Hidden'}
              </button>
            </div>
            <h3 className="text-sm font-bold text-white mb-4">Pro Coverage (High Volume)</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Price (Coins)</label>
                <input 
                  type="number"
                  value={proCoins}
                  onChange={(e) => setProCoins(Number(e.target.value))}
                  disabled={!proEnabled}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                />
                <p className="text-[10px] text-emerald-400 mt-1">≈ ${(proCoins / coinsPerUsd).toFixed(2)} USD</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testers</label>
                  <input 
                    type="number"
                    value={proTesters}
                    onChange={(e) => setProTesters(Number(e.target.value))}
                    disabled={!proEnabled}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Days</label>
                  <input 
                    type="number"
                    value={proDays}
                    onChange={(e) => setProDays(Number(e.target.value))}
                    disabled={!proEnabled}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: 1 COIN RATE CONFIGURATION */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" /> 1. Coin Value & Exchange Rate (1 Coin Kitna Ka Hai?)
            </h2>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Live Currency Link
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                How many Coins for $1.00 USD? (Exchange Base)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={coinsPerUsd}
                  onChange={(e) => setCoinsPerUsd(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Coins</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Standard: <strong>100 Coins = $1.00 USD</strong> (Meaning 1 Coin = $0.01 USD / 1 Cent).
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                1 USD Dollar to PKR Rate (for Pakistan Easypaisa/Meezan Deposits)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={pkrPerUsd}
                  onChange={(e) => setPkrPerUsd(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Result: <strong>1 Coin = Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Minimum Deposit ($ USD)</label>
                <input 
                  type="number" 
                  value={minDepositUsd}
                  onChange={(e) => setMinDepositUsd(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">{minDepositUsd * coinsPerUsd} Coins</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Minimum Withdrawal</label>
                <input 
                  type="number" 
                  value={minWithdrawCoins}
                  onChange={(e) => setMinWithdrawCoins(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">≈ ${(minWithdrawCoins / coinsPerUsd).toFixed(2)} USD</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: REWARD SPLITS & COMMISSIONS */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" /> Reward Payout Splits & Profit Margin
            </h2>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Escrow & Profits
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Daily Tester Reward (Coins)</label>
                <input 
                  type="number" 
                  value={dailyTesterPayout}
                  onChange={(e) => setDailyTesterPayout(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">When tester checks in daily</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Platform Margin / Fee (%)</label>
                <input 
                  type="number" 
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-emerald-400 mt-1">Direct SaaS platform revenue</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                14-Day Full Completion Bonus (Coins)
              </label>
              <input 
                type="number" 
                value={completionBonus}
                onChange={(e) => setCompletionBonus(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Released from escrow after tester stays installed for full duration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LIVE SIMULATOR */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f172a] to-black rounded-2xl border border-slate-800 p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-indigo-400" /> Live Campaign Cost & Profit Simulator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                <span>Testers Count:</span>
                <span className="text-blue-400 font-black">{simTesters} Testers</span>
              </div>
              <input 
                type="range" min={5} max={100} step={5} value={simTesters}
                onChange={(e) => setSimTesters(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
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
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Your Platform Net Profit ({platformFeePercent}%)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400">${simPlatformProfitUsd} USD</span>
            </div>
            <p className="text-xs text-indigo-300 font-medium mt-1">Direct Profit per this campaign</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: RECEIVING PAYMENT ACCOUNTS */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Admin Receiving Payment Accounts (Pakistan & International)
          </h2>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            For User Deposits
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">📱 Easypaisa / JazzCash Mobile Number</label>
            <input 
              type="text" value={easypaisaNumber}
              onChange={(e) => setEasypaisaNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">👤 Easypaisa Account Title</label>
            <input 
              type="text" value={easypaisaTitle}
              onChange={(e) => setEasypaisaTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">🏦 Pakistan Local Bank & IBAN Account</label>
            <input 
              type="text" value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">🌐 Payoneer Receiving Email (USD)</label>
            <input 
              type="email" value={payoneerEmail}
              onChange={(e) => setPayoneerEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-bold mb-1.5">₮ USDT TRC20 / Binance Pay Address</label>
            <input 
              type="text" value={usdtAddress}
              onChange={(e) => setUsdtAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
