import { Save, Shield, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-saas-text-muted mt-1">Configure global platform behavior and AI modules.</p>
        </div>
        <button className="px-4 py-2 bg-saas-accent text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-saas-card rounded-xl border border-saas-border overflow-hidden">
          <div className="p-6 border-b border-saas-border">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-saas-text-muted" /> General Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Maintenance Mode</p>
                <p className="text-sm text-saas-text-muted">Disable all customer/tester logins temporarily.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-saas-border bg-saas-dark text-saas-accent focus:ring-saas-accent focus:ring-offset-saas-dark" />
            </label>
            <div className="h-px bg-saas-border w-full"></div>
            <div>
              <label className="block text-sm font-medium text-saas-text-muted mb-2">Platform Fee Percentage</label>
              <input type="number" defaultValue={20} className="w-full bg-saas-dark border border-saas-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-saas-accent" />
            </div>
          </div>
        </div>

        <div className="bg-saas-card rounded-xl border border-saas-border overflow-hidden">
          <div className="p-6 border-b border-saas-border">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-saas-text-muted" /> AI & Automation
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Auto-approve Quality Testers</p>
                <p className="text-sm text-saas-text-muted">Automatically approve testers with a score &gt; 4.5 for campaigns.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-saas-border bg-saas-dark text-saas-accent focus:ring-saas-accent focus:ring-offset-saas-dark" />
            </label>
            <div className="h-px bg-saas-border w-full"></div>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">AI App Verification</p>
                <p className="text-sm text-saas-text-muted">Use Gemini AI to check Play Store guidelines before campaign start.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-saas-border bg-saas-dark text-saas-accent focus:ring-saas-accent focus:ring-offset-saas-dark" />
            </label>
          </div>
        </div>
        <div className="bg-saas-card rounded-xl border border-saas-border overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-saas-border">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🪙</span> Financial & Coin Settings
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-white mb-2">Coin Pricing (Exchange Rate)</h3>
              <div>
                <label className="block text-sm font-medium text-saas-text-muted mb-2">1 USD equals how many Coins?</label>
                <input type="number" defaultValue={100} className="w-full bg-saas-dark border border-saas-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-saas-accent" />
                <p className="text-xs text-saas-text-muted mt-2">Current Rate: $1.00 USD = 100 🪙</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-white mb-2">Admin Receiving Accounts</h3>
              <p className="text-xs text-saas-text-muted mb-4">Customers will see these details when they want to buy Coins.</p>
              
              <div>
                <label className="block text-sm font-medium text-saas-text-muted mb-2">Local Bank (PKR)</label>
                <input type="text" defaultValue="Meezan Bank, Acc: 123456789 (Umar Hayat)" className="w-full bg-saas-dark border border-saas-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-saas-accent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-saas-text-muted mb-2">Easypaisa / JazzCash</label>
                <input type="text" defaultValue="0300-1234567" className="w-full bg-saas-dark border border-saas-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-saas-accent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-saas-text-muted mb-2">Payoneer / USDT (Binance Pay)</label>
                <input type="text" defaultValue="pay@12testgig.com" className="w-full bg-saas-dark border border-saas-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-saas-accent text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
