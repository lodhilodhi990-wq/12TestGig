import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Save, 
  CheckCircle2
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function DepositMethods() {
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

  // MANUAL PAYMENT METHODS
  const [easypaisaEnabled, setEasypaisaEnabled] = useState<boolean>(initial?.manualMethods?.easypaisa?.enabled ?? true);
  const [easypaisaTitle, setEasypaisaTitle] = useState<string>(initial?.manualMethods?.easypaisa?.accountTitle ?? initial?.easypaisaTitle ?? 'Umar Hayat');
  const [easypaisaNumber, setEasypaisaNumber] = useState<string>(initial?.manualMethods?.easypaisa?.accountNumber ?? initial?.easypaisaNumber ?? '0300-1234567');
  const [easypaisaNote, setEasypaisaNote] = useState<string>(initial?.manualMethods?.easypaisa?.instructions ?? 'Send PKR to this Easypaisa mobile account and enter Transaction ID (TID).');
  const [easypaisaMinUsd, setEasypaisaMinUsd] = useState<number>(initial?.manualMethods?.easypaisa?.minDepositUsd ?? 5);

  const [jazzcashEnabled, setJazzcashEnabled] = useState<boolean>(initial?.manualMethods?.jazzcash?.enabled ?? true);
  const [jazzcashTitle, setJazzcashTitle] = useState<string>(initial?.manualMethods?.jazzcash?.accountTitle ?? 'Umar Hayat');
  const [jazzcashNumber, setJazzcashNumber] = useState<string>(initial?.manualMethods?.jazzcash?.accountNumber ?? '0301-7654321');
  const [jazzcashNote, setJazzcashNote] = useState<string>(initial?.manualMethods?.jazzcash?.instructions ?? 'Send PKR via JazzCash app or mobile account and provide Sender Number & TID.');
  const [jazzcashMinUsd, setJazzcashMinUsd] = useState<number>(initial?.manualMethods?.jazzcash?.minDepositUsd ?? 5);

  const [bankEnabled, setBankEnabled] = useState<boolean>(initial?.manualMethods?.bankTransfer?.enabled ?? true);
  const [bankName, setBankName] = useState<string>(initial?.manualMethods?.bankTransfer?.bankName ?? 'Meezan Bank Ltd');
  const [bankTitle, setBankTitle] = useState<string>(initial?.manualMethods?.bankTransfer?.accountTitle ?? 'Umar Hayat');
  const [bankAccountNo, setBankAccountNo] = useState<string>(initial?.manualMethods?.bankTransfer?.accountNumber ?? '01020304050607');
  const [bankIban, setBankIban] = useState<string>(initial?.manualMethods?.bankTransfer?.iban ?? 'PK64MEZN0000001020304050');
  const [bankRaastId, setBankRaastId] = useState<string>(initial?.manualMethods?.bankTransfer?.raastId ?? '03001234567');
  const [bankNote, setBankNote] = useState<string>(initial?.manualMethods?.bankTransfer?.instructions ?? 'Direct 1-minute transfer via Raast ID or Bank IBAN. Enter Bank Reference No. below.');
  const [bankMinUsd, setBankMinUsd] = useState<number>(initial?.manualMethods?.bankTransfer?.minDepositUsd ?? 10);

  const [usdtEnabled, setUsdtEnabled] = useState<boolean>(initial?.manualMethods?.usdtCrypto?.enabled ?? true);
  const [usdtNetwork, setUsdtNetwork] = useState<string>(initial?.manualMethods?.usdtCrypto?.network ?? 'USDT TRC-20 (Tron)');
  const [usdtAddress, setUsdtAddress] = useState<string>(initial?.manualMethods?.usdtCrypto?.accountNumber ?? initial?.usdtAddress ?? 'T9yD14Nj9yDbvWzV1234567890abcdef');
  const [binancePayId, setBinancePayId] = useState<string>(initial?.manualMethods?.usdtCrypto?.raastId ?? '827491039');
  const [usdtNote, setUsdtNote] = useState<string>(initial?.manualMethods?.usdtCrypto?.instructions ?? 'Send USDT (TRC-20) or Binance Pay ID. Provide the Transaction Hash (TxID).');
  const [usdtMinUsd, setUsdtMinUsd] = useState<number>(initial?.manualMethods?.usdtCrypto?.minDepositUsd ?? 10);

  const [payoneerEnabled, setPayoneerEnabled] = useState<boolean>(initial?.manualMethods?.payoneer?.enabled ?? true);
  const [payoneerTitle, setPayoneerTitle] = useState<string>(initial?.manualMethods?.payoneer?.accountTitle ?? '12 Test Gig LLC');
  const [payoneerEmail, setPayoneerEmail] = useState<string>(initial?.manualMethods?.payoneer?.accountNumber ?? initial?.payoneerEmail ?? 'pay@12testgig.com');
  const [payoneerNote, setPayoneerNote] = useState<string>(initial?.manualMethods?.payoneer?.instructions ?? 'Make in-network transfer via Payoneer to email pay@12testgig.com.');
  const [payoneerMinUsd, setPayoneerMinUsd] = useState<number>(initial?.manualMethods?.payoneer?.minDepositUsd ?? 20);

  const [sadapayEnabled, setSadapayEnabled] = useState<boolean>(initial?.manualMethods?.sadapay?.enabled ?? false);
  const [sadapayTitle, setSadapayTitle] = useState<string>(initial?.manualMethods?.sadapay?.accountTitle ?? 'Umar Hayat');
  const [sadapayNumber, setSadapayNumber] = useState<string>(initial?.manualMethods?.sadapay?.accountNumber ?? '0300-1234567');
  const [sadapayNote, setSadapayNote] = useState<string>(initial?.manualMethods?.sadapay?.instructions ?? 'Send money to SadaPay / NayaPay wallet number and upload screenshot.');
  const [sadapayMinUsd, setSadapayMinUsd] = useState<number>(initial?.manualMethods?.sadapay?.minDepositUsd ?? 5);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform_settings', 'pricing_rates'));
        if (snap.exists()) {
          const d = snap.data();
          const m = d.manualMethods || {};
          if (m.easypaisa) {
            setEasypaisaEnabled(Boolean(m.easypaisa.enabled));
            if (m.easypaisa.accountTitle) setEasypaisaTitle(m.easypaisa.accountTitle);
            if (m.easypaisa.accountNumber) setEasypaisaNumber(m.easypaisa.accountNumber);
            if (m.easypaisa.instructions) setEasypaisaNote(m.easypaisa.instructions);
            if (m.easypaisa.minDepositUsd) setEasypaisaMinUsd(Number(m.easypaisa.minDepositUsd));
          }
          if (m.jazzcash) {
            setJazzcashEnabled(Boolean(m.jazzcash.enabled));
            if (m.jazzcash.accountTitle) setJazzcashTitle(m.jazzcash.accountTitle);
            if (m.jazzcash.accountNumber) setJazzcashNumber(m.jazzcash.accountNumber);
            if (m.jazzcash.instructions) setJazzcashNote(m.jazzcash.instructions);
            if (m.jazzcash.minDepositUsd) setJazzcashMinUsd(Number(m.jazzcash.minDepositUsd));
          }
          if (m.bankTransfer) {
            setBankEnabled(Boolean(m.bankTransfer.enabled));
            if (m.bankTransfer.bankName) setBankName(m.bankTransfer.bankName);
            if (m.bankTransfer.accountTitle) setBankTitle(m.bankTransfer.accountTitle);
            if (m.bankTransfer.accountNumber) setBankAccountNo(m.bankTransfer.accountNumber);
            if (m.bankTransfer.iban) setBankIban(m.bankTransfer.iban);
            if (m.bankTransfer.raastId) setBankRaastId(m.bankTransfer.raastId);
            if (m.bankTransfer.instructions) setBankNote(m.bankTransfer.instructions);
            if (m.bankTransfer.minDepositUsd) setBankMinUsd(Number(m.bankTransfer.minDepositUsd));
          }
          if (m.usdtCrypto) {
            setUsdtEnabled(Boolean(m.usdtCrypto.enabled));
            if (m.usdtCrypto.network) setUsdtNetwork(m.usdtCrypto.network);
            if (m.usdtCrypto.accountNumber) setUsdtAddress(m.usdtCrypto.accountNumber);
            if (m.usdtCrypto.raastId) setBinancePayId(m.usdtCrypto.raastId);
            if (m.usdtCrypto.instructions) setUsdtNote(m.usdtCrypto.instructions);
            if (m.usdtCrypto.minDepositUsd) setUsdtMinUsd(Number(m.usdtCrypto.minDepositUsd));
          }
          if (m.payoneer) {
            setPayoneerEnabled(Boolean(m.payoneer.enabled));
            if (m.payoneer.accountTitle) setPayoneerTitle(m.payoneer.accountTitle);
            if (m.payoneer.accountNumber) setPayoneerEmail(m.payoneer.accountNumber);
            if (m.payoneer.instructions) setPayoneerNote(m.payoneer.instructions);
            if (m.payoneer.minDepositUsd) setPayoneerMinUsd(Number(m.payoneer.minDepositUsd));
          }
          if (m.sadapay) {
            setSadapayEnabled(Boolean(m.sadapay.enabled));
            if (m.sadapay.accountTitle) setSadapayTitle(m.sadapay.accountTitle);
            if (m.sadapay.accountNumber) setSadapayNumber(m.sadapay.accountNumber);
            if (m.sadapay.instructions) setSadapayNote(m.sadapay.instructions);
            if (m.sadapay.minDepositUsd) setSadapayMinUsd(Number(m.sadapay.minDepositUsd));
          }
        }
      } catch (err) {
        console.warn('Load err:', err);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const manualMethods = {
      easypaisa: {
        enabled: Boolean(easypaisaEnabled),
        title: 'Easypaisa (Pakistan)',
        accountTitle: String(easypaisaTitle),
        accountNumber: String(easypaisaNumber),
        instructions: String(easypaisaNote),
        minDepositUsd: Number(easypaisaMinUsd),
        badge: 'Instant PKR'
      },
      jazzcash: {
        enabled: Boolean(jazzcashEnabled),
        title: 'JazzCash (Pakistan)',
        accountTitle: String(jazzcashTitle),
        accountNumber: String(jazzcashNumber),
        instructions: String(jazzcashNote),
        minDepositUsd: Number(jazzcashMinUsd),
        badge: 'Mobile Wallet'
      },
      bankTransfer: {
        enabled: Boolean(bankEnabled),
        title: 'Pakistan Local Bank & Raast (IBAN)',
        bankName: String(bankName),
        accountTitle: String(bankTitle),
        accountNumber: String(bankAccountNo),
        iban: String(bankIban),
        raastId: String(bankRaastId),
        instructions: String(bankNote),
        minDepositUsd: Number(bankMinUsd),
        badge: 'Direct Raast / IBAN'
      },
      usdtCrypto: {
        enabled: Boolean(usdtEnabled),
        title: 'USDT TRC20 & Binance Pay',
        network: String(usdtNetwork),
        accountTitle: '12 Test Gig Binance',
        accountNumber: String(usdtAddress),
        raastId: String(binancePayId),
        instructions: String(usdtNote),
        minDepositUsd: Number(usdtMinUsd),
        badge: 'Crypto Global'
      },
      payoneer: {
        enabled: Boolean(payoneerEnabled),
        title: 'Payoneer / Wise (International USD)',
        accountTitle: String(payoneerTitle),
        accountNumber: String(payoneerEmail),
        instructions: String(payoneerNote),
        minDepositUsd: Number(payoneerMinUsd),
        badge: 'USD Direct'
      },
      sadapay: {
        enabled: Boolean(sadapayEnabled),
        title: 'SadaPay / NayaPay',
        accountTitle: String(sadapayTitle),
        accountNumber: String(sadapayNumber),
        instructions: String(sadapayNote),
        minDepositUsd: Number(sadapayMinUsd),
        badge: 'Fintech Wallet'
      }
    };

    const payload = {
      easypaisaNumber: String(easypaisaNumber),
      easypaisaTitle: String(easypaisaTitle),
      bankDetails: `${bankName} | Acc: ${bankAccountNo} | IBAN: ${bankIban} (${bankTitle})`,
      payoneerEmail: String(payoneerEmail),
      usdtAddress: `${usdtNetwork}: ${usdtAddress} (Binance ID: ${binancePayId})`,
      manualMethods,
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

  const activeCount = [easypaisaEnabled, jazzcashEnabled, bankEnabled, usdtEnabled, payoneerEnabled, sadapayEnabled].filter(Boolean).length;

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            Deposit Accounts (Manual Direct Transfer)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure receiving accounts for JazzCash, Easypaisa, Local Bank IBAN, USDT, and Payoneer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {activeCount} Allowed in User Portal
          </span>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Deposit Accounts'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Deposit accounts saved! Only enabled methods will appear on the user's "Buy Coins" page.
        </div>
      )}

      {/* Grid of Manual Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* 1. EASYPAISA */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${easypaisaEnabled ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 font-black">EP</div>
              <div>
                <h4 className="text-sm font-bold text-white">Easypaisa (Pakistan)</h4>
                <span className="text-[10px] text-emerald-400 font-semibold">Instant Mobile Transfer</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={easypaisaEnabled} 
                onChange={(e) => setEasypaisaEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Account Title (Receiver Name):</label>
              <input 
                type="text" value={easypaisaTitle}
                onChange={(e) => setEasypaisaTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Easypaisa Mobile Number:</label>
              <input 
                type="text" value={easypaisaNumber}
                onChange={(e) => setEasypaisaNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions Shown to User:</label>
              <textarea 
                rows={2} value={easypaisaNote}
                onChange={(e) => setEasypaisaNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 2. JAZZCASH */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${jazzcashEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400 font-black">JC</div>
              <div>
                <h4 className="text-sm font-bold text-white">JazzCash (Pakistan)</h4>
                <span className="text-[10px] text-amber-400 font-semibold">Mobile Wallet Deposit</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={jazzcashEnabled} 
                onChange={(e) => setJazzcashEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Account Title (Receiver Name):</label>
              <input 
                type="text" value={jazzcashTitle}
                onChange={(e) => setJazzcashTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">JazzCash Mobile Number:</label>
              <input 
                type="text" value={jazzcashNumber}
                onChange={(e) => setJazzcashNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions Shown to User:</label>
              <textarea 
                rows={2} value={jazzcashNote}
                onChange={(e) => setJazzcashNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 3. PAKISTAN LOCAL BANK / RAAST */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${bankEnabled ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 font-black">IBAN</div>
              <div>
                <h4 className="text-sm font-bold text-white">Local Bank & Raast (IBAN)</h4>
                <span className="text-[10px] text-blue-400 font-semibold">Direct Interbank & Raast</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={bankEnabled} 
                onChange={(e) => setBankEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bank Name:</label>
                <input 
                  type="text" value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Account Title:</label>
                <input 
                  type="text" value={bankTitle}
                  onChange={(e) => setBankTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">24-Digit IBAN:</label>
              <input 
                type="text" value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Raast ID / Account Number:</label>
              <input 
                type="text" value={bankRaastId}
                onChange={(e) => setBankRaastId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 4. USDT TRC-20 & BINANCE PAY */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${usdtEnabled ? 'border-teal-500/40 shadow-lg shadow-teal-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400 font-black">₮</div>
              <div>
                <h4 className="text-sm font-bold text-white">USDT TRC20 & Binance Pay</h4>
                <span className="text-[10px] text-teal-400 font-semibold">Worldwide Crypto Deposit</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={usdtEnabled} 
                onChange={(e) => setUsdtEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">TRC-20 Wallet Address:</label>
              <input 
                type="text" value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Binance Pay ID (Optional):</label>
              <input 
                type="text" value={binancePayId}
                onChange={(e) => setBinancePayId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions Shown to User:</label>
              <textarea 
                rows={2} value={usdtNote}
                onChange={(e) => setUsdtNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 5. PAYONEER USD */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${payoneerEnabled ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 font-black">P</div>
              <div>
                <h4 className="text-sm font-bold text-white">Payoneer / Wise (USD)</h4>
                <span className="text-[10px] text-indigo-400 font-semibold">Direct In-Network USD</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={payoneerEnabled} 
                onChange={(e) => setPayoneerEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Payoneer Registered Email:</label>
              <input 
                type="text" value={payoneerEmail}
                onChange={(e) => setPayoneerEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Account Title / Company:</label>
              <input 
                type="text" value={payoneerTitle}
                onChange={(e) => setPayoneerTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions Shown to User:</label>
              <textarea 
                rows={2} value={payoneerNote}
                onChange={(e) => setPayoneerNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 6. SADAPAY / NAYAPAY */}
        <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${sadapayEnabled ? 'border-orange-500/40 shadow-lg shadow-orange-500/5' : 'border-slate-800 opacity-60'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400 font-black">SP</div>
              <div>
                <h4 className="text-sm font-bold text-white">SadaPay / NayaPay</h4>
                <span className="text-[10px] text-orange-400 font-semibold">Fintech Mobile Wallet</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" checked={sadapayEnabled} 
                onChange={(e) => setSadapayEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Account Title:</label>
              <input 
                type="text" value={sadapayTitle}
                onChange={(e) => setSadapayTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">SadaPay / NayaPay Number:</label>
              <input 
                type="text" value={sadapayNumber}
                onChange={(e) => setSadapayNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Instructions Shown to User:</label>
              <textarea 
                rows={2} value={sadapayNote}
                onChange={(e) => setSadapayNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
