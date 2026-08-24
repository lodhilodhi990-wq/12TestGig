import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Save, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight, 
  Code, 
  Sparkles,
  Info
} from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AdSenseConfigData {
  enabled: boolean;
  publisherId: string;
  autoAdsEnabled: boolean;
  headerBannerCode: string;
  inFeedCode: string;
  sidebarCode: string;
}

export default function AdSenseManager() {
  const [enabled, setEnabled] = useState(false);
  const [publisherId, setPublisherId] = useState('');
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(false);
  const [headerBannerCode, setHeaderBannerCode] = useState('');
  const [inFeedCode, setInFeedCode] = useState('');
  const [sidebarCode, setSidebarCode] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'platform_settings', 'adsense_config'), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AdSenseConfigData;
          setEnabled(data.enabled || false);
          setPublisherId(data.publisherId || '');
          setAutoAdsEnabled(data.autoAdsEnabled || false);
          setHeaderBannerCode(data.headerBannerCode || '');
          setInFeedCode(data.inFeedCode || '');
          setSidebarCode(data.sidebarCode || '');
        }
      }, (err) => {
        console.warn('AdSense listener warning', err);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await setDoc(doc(db, 'platform_settings', 'adsense_config'), {
        enabled,
        publisherId: publisherId.trim(),
        autoAdsEnabled,
        headerBannerCode: headerBannerCode.trim(),
        inFeedCode: inFeedCode.trim(),
        sidebarCode: sidebarCode.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save AdSense config:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Google AdSense & Marketing Ads Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monetize 12 Test Gig landing page and blog articles with Google AdSense banner and auto ads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
            enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
            {enabled ? 'AdSense LIVE' : 'AdSense Disabled'}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          AdSense settings saved and synced live across the web application!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Master Control Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Master Advertising Switch & Account ID
          </h3>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Enable Google AdSense Advertisements</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                When enabled, ad containers on the Landing page and Blog will render live ads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className="text-2xl transition cursor-pointer"
            >
              {enabled ? (
                <ToggleRight className="w-10 h-10 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-600" />
              )}
            </button>
          </div>

          {/* Publisher ID */}
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
              Google AdSense Publisher ID (Client ID)
            </label>
            <div className="relative">
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400 placeholder-slate-600 outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" /> Found in your Google AdSense console under Account &gt; Settings &gt; Publisher ID.
            </p>
          </div>

          {/* Auto Ads Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Enable Google Auto-Ads</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Let Google automatically place optimized ads throughout the layout.
              </p>
            </div>
            <input
              type="checkbox"
              id="autoAds"
              checked={autoAdsEnabled}
              onChange={(e) => setAutoAdsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Custom Ad Units / Code Snippets */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            Custom Ad Unit Snippets (Optional)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            If you create specific ad units in Google AdSense (e.g. Display Banner, In-article ad), paste their HTML code below. If left empty, responsive standard units will be used.
          </p>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              Top Header Banner Unit Code
            </label>
            <textarea
              rows={3}
              value={headerBannerCode}
              onChange={(e) => setHeaderBannerCode(e.target.value)}
              placeholder="<!-- Google AdSense Header Banner Code -->"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              In-Feed / Blog Article Ad Unit Code
            </label>
            <textarea
              rows={3}
              value={inFeedCode}
              onChange={(e) => setInFeedCode(e.target.value)}
              placeholder="<!-- Google AdSense In-Article Code -->"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save AdSense Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
