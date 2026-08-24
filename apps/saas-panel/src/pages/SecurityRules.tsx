import { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  FileCheck, 
  Globe
} from 'lucide-react';

export default function SecurityRules() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-purple-400" />
          Deposit, Payout & Anti-Scam Security Rules
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure proof verification protocols, transaction ID hashing, and automated webhook callback endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* 1. MANUAL DEPOSIT VERIFICATION POLICIES */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Manual Deposit Verification Rules</h3>
              <p className="text-[11px] text-slate-400">Strict checks required before admin approval</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Mandatory Proof Screenshot</p>
                <p className="text-[11px] text-slate-400">Users must upload clear mobile banking receipt/slip</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Unique Transaction ID (TID) Hashing</p>
                <p className="text-[11px] text-slate-400">Blocks duplicate TID submissions from scammers</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/20">
                ENFORCED
              </span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Automated Account Balance Increment</p>
                <p className="text-[11px] text-slate-400">Coins automatically credit to user wallet when approved</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold border border-blue-500/20">
                AUTOMATED
              </span>
            </div>
          </div>
        </div>

        {/* 2. WITHDRAWAL & ESCROW POLICIES */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Withdrawal & Escrow Protection</h3>
              <p className="text-[11px] text-slate-400">Prevents double payouts and guarantees tester balances</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Instant Balance Lock in Escrow</p>
                <p className="text-[11px] text-slate-400">Requested coins are immediately deducted into escrow</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-bold border border-amber-500/20">
                PROTECTED
              </span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Auto-Refund on Rejection</p>
                <p className="text-[11px] text-slate-400">Rejected payouts automatically return coins to tester</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Admin TID Reference Tagging</p>
                <p className="text-[11px] text-slate-400">Bank receipt TID is attached to tester payout receipt</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold border border-blue-500/20">
                RECORDED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PLATFORM WEBHOOK URLS */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Globe className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Official Webhook Callback Endpoints</h3>
            <p className="text-[11px] text-slate-400">Copy and configure these webhook URLs in your merchant developer dashboards.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold">JazzCash IPN Callback URL:</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" readOnly value="https://12testgig.com/api/webhooks/payment/jazzcash"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-300 font-mono text-[11px]"
              />
              <button 
                type="button" 
                onClick={() => handleCopy('https://12testgig.com/api/webhooks/payment/jazzcash', 'jc_webhook')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedField === 'jc_webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold">Easypaisa DirectPay Webhook URL:</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" readOnly value="https://12testgig.com/api/webhooks/payment/easypaisa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-300 font-mono text-[11px]"
              />
              <button 
                type="button" 
                onClick={() => handleCopy('https://12testgig.com/api/webhooks/payment/easypaisa', 'ep_webhook')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedField === 'ep_webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
