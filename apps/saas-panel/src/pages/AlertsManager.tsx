import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Save, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  Sliders, 
  PhoneCall
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AlertSettings {
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  whatsappGatewayMode: 'direct_link' | 'api_cloud' | 'twilio' | 'webhook';
  whatsappApiUrl?: string;
  whatsappApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromPhone?: string;

  emailGatewayMode: 'smtp' | 'resend' | 'sendgrid' | 'webhook';
  emailApiKey?: string;
  emailFrom?: string;

  // Notification Message Templates
  depositApprovedTpl: string;
  depositRejectedTpl: string;
  withdrawalDispatchedTpl: string;
  newCampaignTpl: string;
  supportTicketReplyTpl: string;
}

export const DEFAULT_ALERTS: AlertSettings = {
  whatsappEnabled: true,
  emailEnabled: true,
  whatsappGatewayMode: 'direct_link',
  emailGatewayMode: 'resend',
  emailFrom: 'notifications@12testgig.com',

  depositApprovedTpl: `Assalam-o-Alaikum {name}! 🎉
Your deposit of Rs {amount} PKR (${'{usd}'} USD) has been verified and APPROVED on 12 Test Gig.
🪙 {coins} Coins have been added to your balance.
Track campaigns: https://12-test-gig.vercel.app/customer/projects`,

  depositRejectedTpl: `Assalam-o-Alaikum {name}! ⚠️
Your deposit request of Rs {amount} PKR on 12 Test Gig could not be approved.
Reason: {reason}
If this was a mistake, please open support: https://12-test-gig.vercel.app/tester/support`,

  withdrawalDispatchedTpl: `Assalam-o-Alaikum {name}! 💰
Your cashout payout of {coins} Coins (Rs {amount} PKR) via {method} has been DISPATCHED!
Transaction Ref / TID: {txId}
Thank you for being a certified tester on 12 Test Gig!`,

  newCampaignTpl: `Assalam-o-Alaikum {name}! 🚀
A new Google Play 14-Day Closed Test '{appTitle}' is now open for your Android device!
Earn {coins} Coins daily + 14-day completion bonus.
Join now: https://12-test-gig.vercel.app/tester/tests`,

  supportTicketReplyTpl: `Assalam-o-Alaikum {name}! 🎧
Admin has replied to your Support Ticket #{ticketId}:
"{message}"
View discussion: https://12-test-gig.vercel.app/tester/support`
};

export default function AlertsManager() {
  const [config, setConfig] = useState<AlertSettings>(DEFAULT_ALERTS);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Test WhatsApp Sender State
  const [testPhone, setTestPhone] = useState('03001234567');
  const [testTemplate, setTestTemplate] = useState<'deposit' | 'withdrawal' | 'custom'>('deposit');
  const [testCustomMsg, setTestCustomMsg] = useState('Assalam-o-Alaikum! This is a test broadcast from 12 Test Gig.');

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform_settings', 'alerts_config'));
        if (snap.exists()) {
          setConfig({ ...DEFAULT_ALERTS, ...snap.data() as AlertSettings });
        }
      } catch (err) {
        console.warn('Alerts config load error:', err);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'platform_settings', 'alerts_config'), {
        ...config,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      alert('WhatsApp and Email alert configurations saved successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Could not save alert settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestWhatsApp = () => {
    let clean = testPhone.replace(/[^0-9]/g, '');
    if (clean.startsWith('03')) clean = '92' + clean.slice(1);

    let text = testCustomMsg;
    if (testTemplate === 'deposit') {
      text = config.depositApprovedTpl
        .replace('{name}', 'Umar Farooq')
        .replace('{amount}', '5,600')
        .replace('{usd}', '20')
        .replace('{coins}', '2,000');
    } else if (testTemplate === 'withdrawal') {
      text = config.withdrawalDispatchedTpl
        .replace('{name}', 'Ali Tester')
        .replace('{coins}', '1,500')
        .replace('{amount}', '4,200')
        .replace('{method}', 'JazzCash')
        .replace('{txId}', 'TID-8921849');
    }

    const url = `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Automated WhatsApp & Email Alerts Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure instant WhatsApp message links, Twilio/Cloud API, and automated email notifications for deposits, payouts, and tickets.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Alert Configurations'}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Alert settings saved and synced! Direct WhatsApp buttons in Deposits and Withdrawals are active.
        </div>
      )}

      {/* MASTER TOGGLES & GATEWAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Gateway Settings */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                WA
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">WhatsApp Alerts Engine</h3>
                <p className="text-[11px] text-slate-400">1-Click instant chat links or automated API dispatch</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.whatsappEnabled}
                onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className={`text-xs font-bold ${config.whatsappEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {config.whatsappEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
                WhatsApp Dispatch Mode
              </label>
              <select
                value={config.whatsappGatewayMode}
                onChange={(e) => setConfig({ ...config, whatsappGatewayMode: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="direct_link">Direct WhatsApp Web / App Link (100% Free, Zero API cost)</option>
                <option value="twilio">Twilio Programmable WhatsApp API</option>
                <option value="api_cloud">Meta WhatsApp Cloud API</option>
                <option value="webhook">Custom Webhook Dispatcher</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                {config.whatsappGatewayMode === 'direct_link' 
                  ? 'Opens pre-filled WhatsApp message with user phone number & notification text on admin approval.'
                  : 'Automates background API dispatch using your API credentials.'}
              </p>
            </div>

            {config.whatsappGatewayMode === 'twilio' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-400 text-[10px] mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    value={config.twilioAccountSid || ''}
                    onChange={(e) => setConfig({ ...config, twilioAccountSid: e.target.value })}
                    placeholder="ACXXXXXXXXXXXXXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 text-[10px] mb-1">Twilio Auth Token</label>
                  <input
                    type="password"
                    value={config.twilioAuthToken || ''}
                    onChange={(e) => setConfig({ ...config, twilioAuthToken: e.target.value })}
                    placeholder="••••••••••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Gateway Settings */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Automated Email Gateway</h3>
                <p className="text-[11px] text-slate-400">Send transactional receipts, verification codes & updates</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.emailEnabled}
                onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={`text-xs font-bold ${config.emailEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
                {config.emailEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
                Email Provider / Protocol
              </label>
              <select
                value={config.emailGatewayMode}
                onChange={(e) => setConfig({ ...config, emailGatewayMode: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="resend">Resend API (Fast & Modern)</option>
                <option value="sendgrid">SendGrid Email API</option>
                <option value="smtp">Standard SMTP Server (Gmail / Hostinger / cPanel)</option>
                <option value="webhook">Custom Webhook Callback</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-400 text-[10px] mb-1">From Sender Email</label>
                <input
                  type="email"
                  value={config.emailFrom || 'notifications@12testgig.com'}
                  onChange={(e) => setConfig({ ...config, emailFrom: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 text-[10px] mb-1">API Key / Secret</label>
                <input
                  type="password"
                  value={config.emailApiKey || ''}
                  onChange={(e) => setConfig({ ...config, emailApiKey: e.target.value })}
                  placeholder="re_xxxxxxxx or SG.xxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TEMPLATES EDITOR */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Custom Message Templates (WhatsApp & Email)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize the message text sent to users with dynamic tags: <code className="text-amber-400">{'{name}'}</code>, <code className="text-amber-400">{'{amount}'}</code>, <code className="text-amber-400">{'{coins}'}</code>, <code className="text-amber-400">{'{method}'}</code>, <code className="text-amber-400">{'{txId}'}</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Deposit Approved Template */}
          <div className="space-y-1.5">
            <label className="block font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
              1. Deposit Approved Notification
            </label>
            <textarea
              rows={4}
              value={config.depositApprovedTpl}
              onChange={(e) => setConfig({ ...config, depositApprovedTpl: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Withdrawal Dispatched Template */}
          <div className="space-y-1.5">
            <label className="block font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
              2. Payout / Withdrawal Dispatched Notification
            </label>
            <textarea
              rows={4}
              value={config.withdrawalDispatchedTpl}
              onChange={(e) => setConfig({ ...config, withdrawalDispatchedTpl: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Deposit Rejected Template */}
          <div className="space-y-1.5">
            <label className="block font-bold text-red-400 uppercase tracking-wider text-[10px]">
              3. Deposit Rejected Notification
            </label>
            <textarea
              rows={4}
              value={config.depositRejectedTpl}
              onChange={(e) => setConfig({ ...config, depositRejectedTpl: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* New Campaign Available */}
          <div className="space-y-1.5">
            <label className="block font-bold text-blue-400 uppercase tracking-wider text-[10px]">
              4. New App Campaign Available Broadcast
            </label>
            <textarea
              rows={4}
              value={config.newCampaignTpl}
              onChange={(e) => setConfig({ ...config, newCampaignTpl: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* DIRECT WHATSAPP TEST SENDER TOOL */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          Direct WhatsApp Message Simulator & Test Tool
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block font-bold text-slate-400 text-[10px] mb-1">Target Phone Number</label>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="03001234567 or 923001234567"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-400 text-[10px] mb-1">Select Message Type</label>
            <select
              value={testTemplate}
              onChange={(e) => setTestTemplate(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="deposit">Deposit Approved Sample</option>
              <option value="withdrawal">Withdrawal Dispatched Sample</option>
              <option value="custom">Custom Broadcast Text</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSendTestWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Test Open WhatsApp
            </button>
          </div>
        </div>

        {testTemplate === 'custom' && (
          <div className="pt-2">
            <label className="block font-bold text-slate-400 text-[10px] mb-1">Custom Message Text</label>
            <textarea
              rows={2}
              value={testCustomMsg}
              onChange={(e) => setTestCustomMsg(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
