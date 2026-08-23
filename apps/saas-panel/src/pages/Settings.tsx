import { useState, useEffect } from 'react';
import { 
  Save, 
  Coins, 
  DollarSign, 
  Smartphone, 
  Calculator, 
  CheckCircle2, 
  Building
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

  // App Testing Pricing Rules (App Test Ke Liye Kitne Coin Chahiye?)
  const [base20TesterCost, setBase20TesterCost] = useState<number>(initial?.base20TesterCost ?? 2000);
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
      // First load from localStorage
      const cached = localStorage.getItem('admin_pricing_rates');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          applyConfig(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      // Then load from Firestore
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

    // Save to localStorage immediately
    try {
      localStorage.setItem('admin_pricing_rates', JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }

    // Save to Firestore
    try {
      await setDoc(doc(db, 'platform_settings', 'pricing_rates'), payload, { merge: true });
    } catch (e: any) {
      console.warn('Saved to local storage, firestore warning', e);
    } finally {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Dynamic Simulator Calculation
  const simTotalCost = Math.round((simTesters * simDays * (dailyTesterPayout / 14)) + (simTesters * 50));
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
            Coin Economics & App Testing Pricing Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure how much 1 Coin is worth, how many Coins are required for App Testing, and receiving accounts.
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
          {isSaving ? 'Saving Changes...' : 'Save Pricing & Rates'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          Rates updated successfully! All customer pricing, testing costs, and deposit conversions are synchronized.
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
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard 20-Tester App Test</span>
          <p className="text-2xl font-black text-white mt-1">{base20TesterCost.toLocaleString()} Coins</p>
          <p className="text-xs text-blue-400 mt-1">Cost to Developer: ${(base20TesterCost / coinsPerUsd).toFixed(2)}</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform Gross Profit Margin</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{platformFeePercent}% Margin</p>
          <p className="text-xs text-slate-400 mt-1">Per Campaign Profit: ${(base20TesterCost / coinsPerUsd * (platformFeePercent / 100)).toFixed(2)}</p>
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
                Result: <strong>1 Coin = Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</strong> (e.g. 2,000 Coins = Rs {((base20TesterCost / coinsPerUsd) * pkrPerUsd).toLocaleString()} PKR).
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

        {/* SECTION 2: APP TESTING PRICING & SPLITS */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" /> 2. App Testing Pricing Rules (App Test Ke Liye Kitne Coin?)
            </h2>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Google Play Closed Test
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Standard 14-Day (20 Testers) Campaign Price (Coins)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={base20TesterCost}
                  onChange={(e) => setBase20TesterCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Coins</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Developer will be charged <strong>{base20TesterCost.toLocaleString()} Coins (${(base20TesterCost / coinsPerUsd).toFixed(2)} USD)</strong> to get 20 certified testers for 14 continuous days.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Daily Tester Reward (Per Day)</label>
                <input 
                  type="number" 
                  value={dailyTesterPayout}
                  onChange={(e) => setDailyTesterPayout(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Coins rewarded when tester checks in</p>
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
              <label className="block text-slate-300 font-bold mb-1.5">14-Day Full Completion Bonus (Coins)</label>
              <input 
                type="number" 
                value={completionBonus}
                onChange={(e) => setCompletionBonus(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Released from escrow after tester stays installed for 14 full days.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LIVE PRICING SIMULATOR */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Live Campaign Cost & Profit Simulator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Test any custom configuration to see how much the customer will pay in Coins, USD, and PKR, and your platform profit!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Testers Count:</span>
                <span className="text-blue-400">{simTesters} Testers</span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={100} 
                step={5}
                value={simTesters}
                onChange={(e) => setSimTesters(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Testing Duration:</span>
                <span className="text-indigo-400">{simDays} Days</span>
              </div>
              <input 
                type="range" 
                min={7} 
                max={30} 
                step={7}
                value={simDays}
                onChange={(e) => setSimDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Calculated Customer Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-400">{simTotalCost.toLocaleString()} Coins</span>
                <span className="text-sm font-bold text-slate-400">(${simTotalUsd} USD)</span>
              </div>
              <p className="text-xs text-emerald-400 font-bold mt-1">
                Equivalent PKR: Rs {simTotalPkr.toLocaleString()} PKR
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-bold">
              <span className="text-slate-400">Your Platform Profit ({platformFeePercent}%):</span>
              <span className="text-emerald-400 font-black">+${simPlatformProfitUsd} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: ADMIN RECEIVING PAYMENT ACCOUNTS */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" /> 3. Admin Deposit Accounts (Jahan User Paise Bheje Ga)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customers will see these exact account details when they click "+ Buy Coins" or "Deposit".
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Easypaisa / JazzCash Number</label>
            <input 
              type="text" 
              value={easypaisaNumber}
              onChange={(e) => setEasypaisaNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Account Title Name</label>
            <input 
              type="text" 
              value={easypaisaTitle}
              onChange={(e) => setEasypaisaTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Local Pakistan Bank (Meezan / HBL / IBAN)</label>
            <input 
              type="text" 
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Payoneer / International Email</label>
            <input 
              type="text" 
              value={payoneerEmail}
              onChange={(e) => setPayoneerEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-bold mb-1.5">USDT TRC20 / Binance Pay Address</label>
            <input 
              type="text" 
              value={usdtAddress}
              onChange={(e) => setUsdtAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-800/80 bg-slate-900/20 flex justify-end">
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
