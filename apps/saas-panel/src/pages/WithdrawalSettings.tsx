import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Save, 
  CheckCircle2
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function WithdrawalSettings() {
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

  // Exchange rate reference
  const coinsPerUsd = initial?.coinsPerUsd ?? 100;
  const pkrPerUsd = initial?.pkrPerUsd ?? 280;

  // Withdrawal Master Limits
  const [minWithdrawCoins, setMinWithdrawCoins] = useState<number>(initial?.minWithdrawCoins ?? 500);
  const [maxWithdrawCoins, setMaxWithdrawCoins] = useState<number>(initial?.maxWithdrawCoins ?? 50000);
  const [withdrawalProcessingTime, setWithdrawalProcessingTime] = useState<string>(initial?.withdrawalProcessingTime ?? '1 to 24 Hours');
  const [withdrawalFeePercent, setWithdrawalFeePercent] = useState<number>(initial?.withdrawalFeePercent ?? 0);
  const [withdrawalDailyLimitCoins, setWithdrawalDailyLimitCoins] = useState<number>(initial?.withdrawalDailyLimitCoins ?? 100000);

  // Method by Method
  const [withdrawJcEnabled, setWithdrawJcEnabled] = useState<boolean>(initial?.withdrawalMethods?.jazzcash?.enabled ?? true);
  const [withdrawJcMin, setWithdrawJcMin] = useState<number>(initial?.withdrawalMethods?.jazzcash?.minCoins ?? 500);
  const [withdrawJcMax, setWithdrawJcMax] = useState<number>(initial?.withdrawalMethods?.jazzcash?.maxCoins ?? 50000);
  const [withdrawJcTime, setWithdrawJcTime] = useState<string>(initial?.withdrawalMethods?.jazzcash?.processingTime ?? '1 to 24 Hours');
  const [withdrawJcNote, setWithdrawJcNote] = useState<string>(initial?.withdrawalMethods?.jazzcash?.instructions ?? 'Provide active JazzCash 11-digit mobile number and registered account title.');

  const [withdrawEpEnabled, setWithdrawEpEnabled] = useState<boolean>(initial?.withdrawalMethods?.easypaisa?.enabled ?? true);
  const [withdrawEpMin, setWithdrawEpMin] = useState<number>(initial?.withdrawalMethods?.easypaisa?.minCoins ?? 500);
  const [withdrawEpMax, setWithdrawEpMax] = useState<number>(initial?.withdrawalMethods?.easypaisa?.maxCoins ?? 50000);
  const [withdrawEpTime, setWithdrawEpTime] = useState<string>(initial?.withdrawalMethods?.easypaisa?.processingTime ?? '1 to 24 Hours');
  const [withdrawEpNote, setWithdrawEpNote] = useState<string>(initial?.withdrawalMethods?.easypaisa?.instructions ?? 'Provide active Easypaisa mobile number and registered CNIC account title.');

  const [withdrawBankEnabled, setWithdrawBankEnabled] = useState<boolean>(initial?.withdrawalMethods?.bankTransfer?.enabled ?? true);
  const [withdrawBankMin, setWithdrawBankMin] = useState<number>(initial?.withdrawalMethods?.bankTransfer?.minCoins ?? 1000);
  const [withdrawBankMax, setWithdrawBankMax] = useState<number>(initial?.withdrawalMethods?.bankTransfer?.maxCoins ?? 100000);
  const [withdrawBankTime, setWithdrawBankTime] = useState<string>(initial?.withdrawalMethods?.bankTransfer?.processingTime ?? '2 to 24 Hours');
  const [withdrawBankNote, setWithdrawBankNote] = useState<string>(initial?.withdrawalMethods?.bankTransfer?.instructions ?? 'Provide Bank Name, 24-digit IBAN (or Raast ID), and Exact Account Title.');

  const [withdrawUsdtEnabled, setWithdrawUsdtEnabled] = useState<boolean>(initial?.withdrawalMethods?.usdtCrypto?.enabled ?? true);
  const [withdrawUsdtMin, setWithdrawUsdtMin] = useState<number>(initial?.withdrawalMethods?.usdtCrypto?.minCoins ?? 1000);
  const [withdrawUsdtMax, setWithdrawUsdtMax] = useState<number>(initial?.withdrawalMethods?.usdtCrypto?.maxCoins ?? 200000);
  const [withdrawUsdtTime, setWithdrawUsdtTime] = useState<string>(initial?.withdrawalMethods?.usdtCrypto?.processingTime ?? '1 to 12 Hours');
  const [withdrawUsdtNote, setWithdrawUsdtNote] = useState<string>(initial?.withdrawalMethods?.usdtCrypto?.instructions ?? 'Provide TRC-20 Wallet Address or Binance Pay ID. Fast worldwide crypto payout.');

  const [withdrawPayoEnabled, setWithdrawPayoEnabled] = useState<boolean>(initial?.withdrawalMethods?.payoneer?.enabled ?? true);
  const [withdrawPayoMin, setWithdrawPayoMin] = useState<number>(initial?.withdrawalMethods?.payoneer?.minCoins ?? 2000);
  const [withdrawPayoMax, setWithdrawPayoMax] = useState<number>(initial?.withdrawalMethods?.payoneer?.maxCoins ?? 100000);
  const [withdrawPayoTime, setWithdrawPayoTime] = useState<string>(initial?.withdrawalMethods?.payoneer?.processingTime ?? '12 to 24 Hours');
  const [withdrawPayoNote, setWithdrawPayoNote] = useState<string>(initial?.withdrawalMethods?.payoneer?.instructions ?? 'Provide registered Payoneer email address for direct in-network USD payment.');

  const [withdrawSadaEnabled, setWithdrawSadaEnabled] = useState<boolean>(initial?.withdrawalMethods?.sadapay?.enabled ?? true);
  const [withdrawSadaMin, setWithdrawSadaMin] = useState<number>(initial?.withdrawalMethods?.sadapay?.minCoins ?? 500);
  const [withdrawSadaMax, setWithdrawSadaMax] = useState<number>(initial?.withdrawalMethods?.sadapay?.maxCoins ?? 50000);
  const [withdrawSadaTime, setWithdrawSadaTime] = useState<string>(initial?.withdrawalMethods?.sadapay?.processingTime ?? '1 to 24 Hours');
  const [withdrawSadaNote, setWithdrawSadaNote] = useState<string>(initial?.withdrawalMethods?.sadapay?.instructions ?? 'Provide your SadaPay or NayaPay registered mobile number and title.');

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform_settings', 'pricing_rates'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.minWithdrawCoins !== undefined) setMinWithdrawCoins(Number(d.minWithdrawCoins));
          if (d.maxWithdrawCoins !== undefined) setMaxWithdrawCoins(Number(d.maxWithdrawCoins));
          if (d.withdrawalProcessingTime !== undefined) setWithdrawalProcessingTime(String(d.withdrawalProcessingTime));
          if (d.withdrawalFeePercent !== undefined) setWithdrawalFeePercent(Number(d.withdrawalFeePercent));
          if (d.withdrawalDailyLimitCoins !== undefined) setWithdrawalDailyLimitCoins(Number(d.withdrawalDailyLimitCoins));

          const w = d.withdrawalMethods || {};
          if (w.jazzcash) {
            setWithdrawJcEnabled(Boolean(w.jazzcash.enabled));
            if (w.jazzcash.minCoins !== undefined) setWithdrawJcMin(Number(w.jazzcash.minCoins));
            if (w.jazzcash.maxCoins !== undefined) setWithdrawJcMax(Number(w.jazzcash.maxCoins));
            if (w.jazzcash.processingTime) setWithdrawJcTime(String(w.jazzcash.processingTime));
            if (w.jazzcash.instructions) setWithdrawJcNote(String(w.jazzcash.instructions));
          }
          if (w.easypaisa) {
            setWithdrawEpEnabled(Boolean(w.easypaisa.enabled));
            if (w.easypaisa.minCoins !== undefined) setWithdrawEpMin(Number(w.easypaisa.minCoins));
            if (w.easypaisa.maxCoins !== undefined) setWithdrawEpMax(Number(w.easypaisa.maxCoins));
            if (w.easypaisa.processingTime) setWithdrawEpTime(String(w.easypaisa.processingTime));
            if (w.easypaisa.instructions) setWithdrawEpNote(String(w.easypaisa.instructions));
          }
          if (w.bankTransfer) {
            setWithdrawBankEnabled(Boolean(w.bankTransfer.enabled));
            if (w.bankTransfer.minCoins !== undefined) setWithdrawBankMin(Number(w.bankTransfer.minCoins));
            if (w.bankTransfer.maxCoins !== undefined) setWithdrawBankMax(Number(w.bankTransfer.maxCoins));
            if (w.bankTransfer.processingTime) setWithdrawBankTime(String(w.bankTransfer.processingTime));
            if (w.bankTransfer.instructions) setWithdrawBankNote(String(w.bankTransfer.instructions));
          }
          if (w.usdtCrypto) {
            setWithdrawUsdtEnabled(Boolean(w.usdtCrypto.enabled));
            if (w.usdtCrypto.minCoins !== undefined) setWithdrawUsdtMin(Number(w.usdtCrypto.minCoins));
            if (w.usdtCrypto.maxCoins !== undefined) setWithdrawUsdtMax(Number(w.usdtCrypto.maxCoins));
            if (w.usdtCrypto.processingTime) setWithdrawUsdtTime(String(w.usdtCrypto.processingTime));
            if (w.usdtCrypto.instructions) setWithdrawUsdtNote(String(w.usdtCrypto.instructions));
          }
          if (w.payoneer) {
            setWithdrawPayoEnabled(Boolean(w.payoneer.enabled));
            if (w.payoneer.minCoins !== undefined) setWithdrawPayoMin(Number(w.payoneer.minCoins));
            if (w.payoneer.maxCoins !== undefined) setWithdrawPayoMax(Number(w.payoneer.maxCoins));
            if (w.payoneer.processingTime) setWithdrawPayoTime(String(w.payoneer.processingTime));
            if (w.payoneer.instructions) setWithdrawPayoNote(String(w.payoneer.instructions));
          }
          if (w.sadapay) {
            setWithdrawSadaEnabled(Boolean(w.sadapay.enabled));
            if (w.sadapay.minCoins !== undefined) setWithdrawSadaMin(Number(w.sadapay.minCoins));
            if (w.sadapay.maxCoins !== undefined) setWithdrawSadaMax(Number(w.sadapay.maxCoins));
            if (w.sadapay.processingTime) setWithdrawSadaTime(String(w.sadapay.processingTime));
            if (w.sadapay.instructions) setWithdrawSadaNote(String(w.sadapay.instructions));
          }
        }
      } catch (err) {
        console.warn('Withdrawals settings load err:', err);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const withdrawalMethods = {
      jazzcash: {
        enabled: Boolean(withdrawJcEnabled),
        title: 'JazzCash (Pakistan)',
        minCoins: Number(withdrawJcMin),
        maxCoins: Number(withdrawJcMax),
        processingTime: String(withdrawJcTime),
        feePercent: 0,
        instructions: String(withdrawJcNote),
        badge: 'Fast Mobile Payout'
      },
      easypaisa: {
        enabled: Boolean(withdrawEpEnabled),
        title: 'Easypaisa (Pakistan)',
        minCoins: Number(withdrawEpMin),
        maxCoins: Number(withdrawEpMax),
        processingTime: String(withdrawEpTime),
        feePercent: 0,
        instructions: String(withdrawEpNote),
        badge: 'Instant Mobile Payout'
      },
      bankTransfer: {
        enabled: Boolean(withdrawBankEnabled),
        title: 'Pakistan Local Bank & Raast (IBAN)',
        minCoins: Number(withdrawBankMin),
        maxCoins: Number(withdrawBankMax),
        processingTime: String(withdrawBankTime),
        feePercent: 0,
        instructions: String(withdrawBankNote),
        badge: 'Direct Raast / IBAN'
      },
      usdtCrypto: {
        enabled: Boolean(withdrawUsdtEnabled),
        title: 'USDT (TRC-20) / Binance Pay',
        minCoins: Number(withdrawUsdtMin),
        maxCoins: Number(withdrawUsdtMax),
        processingTime: String(withdrawUsdtTime),
        feePercent: Number(withdrawalFeePercent || 1),
        instructions: String(withdrawUsdtNote),
        badge: 'Global Crypto'
      },
      payoneer: {
        enabled: Boolean(withdrawPayoEnabled),
        title: 'Payoneer (USD Payout)',
        minCoins: Number(withdrawPayoMin),
        maxCoins: Number(withdrawPayoMax),
        processingTime: String(withdrawPayoTime),
        feePercent: 0,
        instructions: String(withdrawPayoNote),
        badge: 'Direct USD'
      },
      sadapay: {
        enabled: Boolean(withdrawSadaEnabled),
        title: 'SadaPay / NayaPay',
        minCoins: Number(withdrawSadaMin),
        maxCoins: Number(withdrawSadaMax),
        processingTime: String(withdrawSadaTime),
        feePercent: 0,
        instructions: String(withdrawSadaNote),
        badge: 'Fintech Payout'
      }
    };

    const payload = {
      minWithdrawCoins: Number(minWithdrawCoins),
      maxWithdrawCoins: Number(maxWithdrawCoins),
      withdrawalProcessingTime: String(withdrawalProcessingTime),
      withdrawalFeePercent: Number(withdrawalFeePercent),
      withdrawalDailyLimitCoins: Number(withdrawalDailyLimitCoins),
      withdrawalMethods,
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

  const activeWithdrawCount = [withdrawJcEnabled, withdrawEpEnabled, withdrawBankEnabled, withdrawUsdtEnabled, withdrawPayoEnabled, withdrawSadaEnabled].filter(Boolean).length;

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-amber-400" />
            Withdrawal Settings & Payout Gateways
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure minimum/maximum cashout limits, SLA processing durations, platform fees, and enabled payout methods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {activeWithdrawCount} Allowed Payouts
          </span>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Withdrawal Settings'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Withdrawal policies, limits and payout methods saved successfully!
        </div>
      )}

      {/* 1. MASTER WITHDRAWAL LIMITS & SLA POLICY */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Master Withdrawal Rules & Processing Time SLA</h2>
              <p className="text-xs text-slate-400">Controls minimum cashout thresholds, turnaround time, and platform fees.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            SLA: {withdrawalProcessingTime}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Minimum Withdrawal Limit (Coins)</label>
            <div className="relative">
              <input 
                type="number" value={minWithdrawCoins} min={100} step={100}
                onChange={(e) => setMinWithdrawCoins(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
              ≈ ${(minWithdrawCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((minWithdrawCoins / coinsPerUsd) * pkrPerUsd)} PKR)
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Maximum Withdrawal Limit (Coins)</label>
            <div className="relative">
              <input 
                type="number" value={maxWithdrawCoins} min={1000} step={1000}
                onChange={(e) => setMaxWithdrawCoins(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Per transaction maximum</p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Processing SLA Time (Shown to User)</label>
            <input 
              type="text" value={withdrawalProcessingTime}
              onChange={(e) => setWithdrawalProcessingTime(e.target.value)}
              placeholder="e.g. 1 to 24 Hours"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">e.g. "1 to 24 Hours" or "Instant (15-30 mins)"</p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Platform Withdrawal Fee (%)</label>
            <div className="relative">
              <input 
                type="number" value={withdrawalFeePercent} min={0} max={50}
                onChange={(e) => setWithdrawalFeePercent(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">0% for zero fee payouts</p>
          </div>
        </div>
      </div>

      {/* 2. METHOD-BY-METHOD WITHDRAWAL GATEWAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* 1. JAZZCASH */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawJcEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400 font-black">JC</div>
              <div>
                <h4 className="text-sm font-bold text-white">JazzCash (Pakistan)</h4>
                <span className="text-[10px] text-amber-400 font-semibold">Mobile Wallet Payout</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawJcEnabled} 
                onChange={(e) => setWithdrawJcEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawJcMin}
                  onChange={(e) => setWithdrawJcMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawJcMax}
                  onChange={(e) => setWithdrawJcMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawJcTime}
                onChange={(e) => setWithdrawJcTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawJcNote}
                onChange={(e) => setWithdrawJcNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 2. EASYPAISA */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawEpEnabled ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 font-black">EP</div>
              <div>
                <h4 className="text-sm font-bold text-white">Easypaisa (Pakistan)</h4>
                <span className="text-[10px] text-emerald-400 font-semibold">Instant Mobile Wallet</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawEpEnabled} 
                onChange={(e) => setWithdrawEpEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawEpMin}
                  onChange={(e) => setWithdrawEpMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawEpMax}
                  onChange={(e) => setWithdrawEpMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawEpTime}
                onChange={(e) => setWithdrawEpTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawEpNote}
                onChange={(e) => setWithdrawEpNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 3. BANK TRANSFER / RAAST */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawBankEnabled ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 font-black">IBAN</div>
              <div>
                <h4 className="text-sm font-bold text-white">Local Bank & Raast (IBAN)</h4>
                <span className="text-[10px] text-blue-400 font-semibold">Direct Bank Payout</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawBankEnabled} 
                onChange={(e) => setWithdrawBankEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawBankMin}
                  onChange={(e) => setWithdrawBankMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawBankMax}
                  onChange={(e) => setWithdrawBankMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawBankTime}
                onChange={(e) => setWithdrawBankTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawBankNote}
                onChange={(e) => setWithdrawBankNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 4. USDT TRC-20 */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawUsdtEnabled ? 'border-teal-500/40 shadow-lg shadow-teal-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400 font-black">₮</div>
              <div>
                <h4 className="text-sm font-bold text-white">USDT (TRC-20) / Binance Pay</h4>
                <span className="text-[10px] text-teal-400 font-semibold">Worldwide Crypto Payout</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawUsdtEnabled} 
                onChange={(e) => setWithdrawUsdtEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawUsdtMin}
                  onChange={(e) => setWithdrawUsdtMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawUsdtMax}
                  onChange={(e) => setWithdrawUsdtMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawUsdtTime}
                onChange={(e) => setWithdrawUsdtTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawUsdtNote}
                onChange={(e) => setWithdrawUsdtNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 5. PAYONEER USD */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawPayoEnabled ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 font-black">P</div>
              <div>
                <h4 className="text-sm font-bold text-white">Payoneer / Wise (USD)</h4>
                <span className="text-[10px] text-indigo-400 font-semibold">Direct USD Email Payout</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawPayoEnabled} 
                onChange={(e) => setWithdrawPayoEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawPayoMin}
                  onChange={(e) => setWithdrawPayoMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawPayoMax}
                  onChange={(e) => setWithdrawPayoMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawPayoTime}
                onChange={(e) => setWithdrawPayoTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawPayoNote}
                onChange={(e) => setWithdrawPayoNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 6. SADAPAY */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawSadaEnabled ? 'border-orange-500/40 shadow-lg shadow-orange-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400 font-black">SP</div>
              <div>
                <h4 className="text-sm font-bold text-white">SadaPay / NayaPay</h4>
                <span className="text-[10px] text-orange-400 font-semibold">Pakistani Fintech Wallet</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={withdrawSadaEnabled} 
                onChange={(e) => setWithdrawSadaEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                <input 
                  type="number" value={withdrawSadaMin}
                  onChange={(e) => setWithdrawSadaMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                <input 
                  type="number" value={withdrawSadaMax}
                  onChange={(e) => setWithdrawSadaMax(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
              <input 
                type="text" value={withdrawSadaTime}
                onChange={(e) => setWithdrawSadaTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
              <textarea 
                rows={2} value={withdrawSadaNote}
                onChange={(e) => setWithdrawSadaNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
