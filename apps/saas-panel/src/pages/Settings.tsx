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
                <p className="text-sm text-saas-text-muted">Automatically approve testers with a score > 4.5 for campaigns.</p>
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
      </div>
    </div>
  );
}
