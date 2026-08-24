import { useState, useEffect } from 'react';
import { 
  Coins, 
  DollarSign, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Award,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PricingPlanItem {
  id: string;
  name: string;
  coins: number;
  badge?: string;
  description: string;
  testers: number;
  days: number;
  popular?: boolean;
  enabled?: boolean;
  features?: string[];
}

export const DEFAULT_PLANS: PricingPlanItem[] = [
  {
    id: 'quick',
    name: 'Quick Audit Pack',
    coins: 1000,
    badge: 'Preliminary Feedback',
    description: 'Best for preliminary feedback and quick UX telemetry before closed testing.',
    testers: 10,
    days: 7,
    popular: false,
    enabled: true,
    features: [
      '10 Testers on real Android devices',
      '7 Days active testing track',
      'Free replacement guarantee'
    ]
  },
  {
    id: 'googleplay',
    name: 'Google Play 14-Day Pack',
    coins: 2000,
    badge: 'Most Popular for Google Play',
    description: 'Full closed testing package designed to meet Google Play Console production requirements.',
    testers: 20,
    days: 14,
    popular: true,
    enabled: true,
    features: [
      '20 Verified Testers on real Android devices',
      '14 Continuous Days active testing track',
      'Free replacement guarantee',
      'Production evaluation telemetry report'
    ]
  },
  {
    id: 'growth',
    name: 'Studio Multi-App Pack',
    coins: 5000,
    badge: 'VIP Agency Coverage',
    description: 'High priority VIP testing for gaming studios and agencies managing multiple apps.',
    testers: 30,
    days: 14,
    popular: false,
    enabled: true,
    features: [
      '30+ Testers on real Android devices',
      '14 Days / Multi-App active testing track',
      'Free replacement guarantee',
      'Priority 24/7 support desk'
    ]
  }
];

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

  // Dynamic Plans Array
  const [plans, setPlans] = useState<PricingPlanItem[]>(initial?.plans ?? DEFAULT_PLANS);

  // Modal State for Plan Editing
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null);
  const [planName, setPlanName] = useState('');
  const [planCoins, setPlanCoins] = useState(2000);
  const [planBadge, setPlanBadge] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planTesters, setPlanTesters] = useState(20);
  const [planDays, setPlanDays] = useState(14);
  const [planPopular, setPlanPopular] = useState(false);
  const [planEnabled, setPlanEnabled] = useState(true);
  const [planFeaturesText, setPlanFeaturesText] = useState('');

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
          if (d.dailyTesterPayout !== undefined) setDailyTesterPayout(Number(d.dailyTesterPayout));
          if (d.completionBonus !== undefined) setCompletionBonus(Number(d.completionBonus));
          if (d.platformFeePercent !== undefined) setPlatformFeePercent(Number(d.platformFeePercent));
          if (d.plans && Array.isArray(d.plans) && d.plans.length > 0) {
            setPlans(d.plans);
          }
        }
      } catch (err) {
        console.warn('Firestore load notice:', err);
      }
    };
    loadData();
  }, []);

  const handleOpenAddPlan = () => {
    setEditingPlanIndex(null);
    setPlanName('');
    setPlanCoins(1500);
    setPlanBadge('New Plan');
    setPlanDesc('Custom testing plan for Android apps.');
    setPlanTesters(15);
    setPlanDays(14);
    setPlanPopular(false);
    setPlanEnabled(true);
    setPlanFeaturesText('15 Testers on real Android devices\n14 Days active testing track\nFree replacement guarantee');
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (idx: number) => {
    const p = plans[idx];
    setEditingPlanIndex(idx);
    setPlanName(p.name);
    setPlanCoins(p.coins);
    setPlanBadge(p.badge || '');
    setPlanDesc(p.description);
    setPlanTesters(p.testers);
    setPlanDays(p.days);
    setPlanPopular(p.popular || false);
    setPlanEnabled(p.enabled !== false);
    setPlanFeaturesText(p.features ? p.features.join('\n') : '');
    setShowPlanModal(true);
  };

  const handleSavePlanItem = (e: React.FormEvent) => {
    e.preventDefault();
    const featArray = planFeaturesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedPlan: PricingPlanItem = {
      id: editingPlanIndex !== null ? plans[editingPlanIndex].id : `plan_${Date.now()}`,
      name: planName,
      coins: Number(planCoins),
      badge: planBadge,
      description: planDesc,
      testers: Number(planTesters),
      days: Number(planDays),
      popular: planPopular,
      enabled: planEnabled,
      features: featArray
    };

    let newPlansList = [...plans];
    if (editingPlanIndex !== null) {
      newPlansList[editingPlanIndex] = updatedPlan;
    } else {
      newPlansList.push(updatedPlan);
    }

    setPlans(newPlansList);
    setShowPlanModal(false);
  };

  const handleDeletePlan = (idx: number) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    setPlans(plans.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      coinsPerUsd: Number(coinsPerUsd),
      pkrPerUsd: Number(pkrPerUsd),
      oneCoinUsd: 1 / Number(coinsPerUsd),
      oneCoinPkr: Number(pkrPerUsd) / Number(coinsPerUsd),
      minDepositUsd: Number(minDepositUsd),

      // Dynamic plans synced with Landing page & Billing
      plans: plans,

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
      alert('Pricing rates and landing page plans saved successfully!');
    } catch (e) {
      console.warn('Save error:', e);
      alert('Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const basePlan = plans.find(p => p.id === 'googleplay') || plans[0] || { coins: 2000, testers: 20, days: 14 };
  const simTotalCost = Math.round((simTesters * simDays * (basePlan.coins / (basePlan.testers * basePlan.days))));
  const simTotalUsd = (simTotalCost / coinsPerUsd).toFixed(2);
  const simTotalPkr = Math.round((simTotalCost / coinsPerUsd) * pkrPerUsd);
  const simPlatformProfitUsd = ((simTotalCost / coinsPerUsd) * (platformFeePercent / 100)).toFixed(2);

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Coin Economics & Landing Page Plans Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure global exchange rates and edit the exact pricing plans shown on the Landing Page and Billing modal.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving Changes...' : 'Save All Settings'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Live rates and Landing Page plans updated and synced across all user portals!
        </div>
      )}

      {/* Exchange Rate Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <DollarSign className="w-4 h-4 text-blue-400" />
          Global Coin Exchange & Currency Rates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Coins Per $1.00 USD
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={coinsPerUsd}
                onChange={(e) => setCoinsPerUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-amber-400 outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">Coins</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">1 Coin = ${(1 / coinsPerUsd).toFixed(4)} USD</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              PKR Per $1.00 USD (Exchange Rate)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={pkrPerUsd}
                onChange={(e) => setPkrPerUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-400 outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">PKR</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">1 Coin = Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Minimum Deposit ($ USD)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={minDepositUsd}
                onChange={(e) => setMinDepositUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">USD</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Min: {minDepositUsd * coinsPerUsd} Coins</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC LANDING PAGE & BILLING PRICING PLANS */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              Landing Page & User Billing Plans
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit the exact packages displayed to visitors on the landing page and developers in the billing section.
            </p>
          </div>

          <button
            onClick={handleOpenAddPlan}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Custom Plan
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const usdCost = (plan.coins / coinsPerUsd).toFixed(2);
            const pkrCost = Math.round((plan.coins / coinsPerUsd) * pkrPerUsd).toLocaleString();

            return (
              <div 
                key={plan.id}
                className={`bg-slate-900 border rounded-3xl p-6 flex flex-col justify-between relative transition ${
                  plan.popular 
                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30' 
                    : 'border-slate-800'
                } ${!plan.enabled ? 'opacity-50' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> Popular
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-slate-800 text-blue-400 text-[10px] font-bold rounded-lg border border-slate-700">
                      {plan.badge || 'Plan'}
                    </span>
                    <span className={`text-[10px] font-bold ${plan.enabled !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {plan.enabled !== false ? '● Live' : '○ Hidden'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="py-3 border-y border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white font-mono">{plan.coins.toLocaleString()}</span>
                      <span className="text-xs font-bold text-amber-400">Coins</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      ${usdCost} USD <span className="text-slate-400 font-normal">/ Rs {pkrCost} PKR</span>
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>{plan.testers}</strong> Testers</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>{plan.days}</strong> Testing Days</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenEditPlan(idx)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Plan
                  </button>
                  <button
                    onClick={() => handleDeletePlan(idx)}
                    className="p-2 bg-slate-800 hover:bg-red-600/30 text-red-400 rounded-xl transition cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROFIT & COMMISSION SPLITS */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Tester Reward Splits & Platform Fee %
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Daily Tester Reward (Coins / Day)
            </label>
            <input
              type="number"
              value={dailyTesterPayout}
              onChange={(e) => setDailyTesterPayout(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-amber-400 outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Given to tester on each daily verified check-in.</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              14-Day Completion Bonus (Coins)
            </label>
            <input
              type="number"
              value={completionBonus}
              onChange={(e) => setCompletionBonus(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-amber-400 outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Bonus for completing all 14 consecutive days.</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Platform Gross Margin / Fee %
            </label>
            <input
              type="number"
              value={platformFeePercent}
              onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-400 outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Retained SaaS profit margin.</p>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Live Revenue & Profit Simulator
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold">Testers:</span>
              <input 
                type="number" 
                min="1" 
                value={simTesters} 
                onChange={(e) => setSimTesters(Number(e.target.value))} 
                className="w-12 bg-transparent text-xs font-bold text-white outline-none font-mono text-center" 
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold">Days:</span>
              <input 
                type="number" 
                min="1" 
                value={simDays} 
                onChange={(e) => setSimDays(Number(e.target.value))} 
                className="w-12 bg-transparent text-xs font-bold text-white outline-none font-mono text-center" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Campaign Size</span>
            <p className="text-lg font-black text-white mt-1">{simTesters} Testers / {simDays} Days</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Customer Pays</span>
            <p className="text-lg font-black text-amber-400 font-mono mt-1">{simTotalCost.toLocaleString()} Coins</p>
            <p className="text-[10px] text-slate-500">${simTotalUsd} USD (Rs {simTotalPkr.toLocaleString()} PKR)</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Margin ({platformFeePercent}%)</span>
            <p className="text-lg font-black text-emerald-400 font-mono mt-1">${simPlatformProfitUsd} USD</p>
            <p className="text-[10px] text-slate-500">Pure Net Profit</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Testers Payout Pool</span>
            <p className="text-lg font-black text-blue-400 font-mono mt-1">${((simTotalCost / coinsPerUsd) * ((100 - platformFeePercent) / 100)).toFixed(2)} USD</p>
            <p className="text-[10px] text-slate-500">Disbursed to certified testers</p>
          </div>
        </div>
      </div>

      {/* PLAN EDIT / CREATE MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingPlanIndex !== null ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
                </h3>
                <p className="text-xs text-slate-400">Updates live on Landing Page and Customer Billing.</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSavePlanItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Plan Title / Name
                </label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. Google Play 14-Day Pack"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Coins Cost
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={planCoins}
                    onChange={(e) => setPlanCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-amber-400 outline-none focus:border-blue-500"
                  />
                  <p className="text-[10px] text-emerald-400 mt-1">
                    ≈ ${(planCoins / coinsPerUsd).toFixed(2)} USD / Rs {Math.round((planCoins / coinsPerUsd) * pkrPerUsd).toLocaleString()} PKR
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={planBadge}
                    onChange={(e) => setPlanBadge(e.target.value)}
                    placeholder="e.g. Most Popular"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Target Testers
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planTesters}
                    onChange={(e) => setPlanTesters(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Testing Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planDays}
                    onChange={(e) => setPlanDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Plan Description
                </label>
                <textarea
                  rows={2}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Brief summary of the plan's ideal use-case."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Features Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  value={planFeaturesText}
                  onChange={(e) => setPlanFeaturesText(e.target.value)}
                  placeholder="20 Verified Testers on real Android devices&#10;14 Continuous Days active track&#10;Free replacement guarantee"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-300 outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pop"
                    checked={planPopular}
                    onChange={(e) => setPlanPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="pop" className="text-xs font-bold text-white cursor-pointer">
                    Highlight as Most Popular
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enab"
                    checked={planEnabled}
                    onChange={(e) => setPlanEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <label htmlFor="enab" className="text-xs font-bold text-white cursor-pointer">
                    Enabled (Live)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Update Plan in List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
