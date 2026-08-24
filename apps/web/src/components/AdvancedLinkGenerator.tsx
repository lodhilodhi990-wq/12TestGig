'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  Sparkles, 
  Sliders, 
  Send, 
  Download, 
  Edit3, 
  Globe, 
  MessageCircle, 
  FileText,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';
import { buildReferralUrl, saveCustomReferralCode } from '@/lib/referralService';
import { User } from '@12-test-gig/types';

interface AdvancedLinkGeneratorProps {
  user: User | null;
  referralCode: string;
  onCodeUpdated?: (newCode: string) => void;
  onSimulateTestReferral?: () => void;
}

const CHANNELS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-emerald-600 bg-emerald-500 text-white' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'hover:bg-sky-600 bg-sky-500 text-white' },
  { id: 'facebook', name: 'Facebook', icon: Globe, color: 'hover:bg-blue-700 bg-blue-600 text-white' },
  { id: 'twitter', name: 'X / Twitter', icon: Share2, color: 'hover:bg-zinc-800 bg-zinc-900 text-white' },
  { id: 'linkedin', name: 'LinkedIn', icon: Globe, color: 'hover:bg-blue-800 bg-blue-700 text-white' },
  { id: 'direct', name: 'Direct / General', icon: LinkIcon, color: 'hover:bg-indigo-600 bg-indigo-500 text-white' },
];

export default function AdvancedLinkGenerator({ user, referralCode, onCodeUpdated, onSimulateTestReferral }: AdvancedLinkGeneratorProps) {
  const [activeChannel, setActiveChannel] = useState<string>('direct');
  const [campaignTag, setCampaignTag] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitchEn, setCopiedPitchEn] = useState(false);
  const [copiedPitchUr, setCopiedPitchUr] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);
  
  // Custom Code Editing
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState(referralCode);
  const [savingCode, setSavingCode] = useState(false);
  const [codeError, setCodeError] = useState('');

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrSize, setQrSize] = useState<number>(220);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setCustomCodeInput(referralCode);
  }, [referralCode]);

  // Generated Link
  const currentReferralLink = useMemo(() => {
    return buildReferralUrl(referralCode, campaignTag, activeChannel);
  }, [referralCode, campaignTag, activeChannel]);

  // Marketing Pre-written Pitches
  const pitchUrdu = useMemo(() => {
    return `🔥 Android Apps Test Karke Daily Paise / Coins Kamao! 💸\n\n` +
      `Agar aapke pas Android phone hai toh "12 Test Gig" par Google Play apps test karein aur har test par direct Coins earn karein jo direct Easypaisa, JazzCash, Bank ya Payoneer me withdraw hotay hain!\n\n` +
      `🚀 Join karne ke liye mera official link use karein:\n${currentReferralLink}\n\n` +
      `✅ 100% Verified Platform | 20-Tester Play Store Tracks | Instant Payouts`;
  }, [currentReferralLink]);

  const pitchEnglish = useMemo(() => {
    return `🚀 Get Paid to Test New Android Apps on Google Play!\n\n` +
      `Join 12 Test Gig closed testing network. Test exciting apps for 14 days, earn Coins, and withdraw cash directly to your preferred payment method (Easypaisa, JazzCash, Bank, Payoneer).\n\n` +
      `👉 Sign up using my exclusive partner link to get started:\n${currentReferralLink}\n\n` +
      `#AppTesting #EarnOnline #GooglePlayTesting #SideHustle`;
  }, [currentReferralLink]);

  const copyToClipboard = (text: string, type: 'link' | 'en' | 'ur') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (type === 'en') {
      setCopiedPitchEn(true);
      setTimeout(() => setCopiedPitchEn(false), 2500);
    } else if (type === 'ur') {
      setCopiedPitchUr(true);
      setTimeout(() => setCopiedPitchUr(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join 12 Test Gig - App Testing Network',
          text: pitchEnglish,
          url: currentReferralLink,
        });
        setNativeShared(true);
        setTimeout(() => setNativeShared(false), 2500);
      } catch (err) {
        copyToClipboard(currentReferralLink, 'link');
      }
    } else {
      copyToClipboard(currentReferralLink, 'link');
    }
  };

  const handleSaveCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;
    setCodeError('');
    setSavingCode(true);

    try {
      await saveCustomReferralCode(user.id, customCodeInput);
      setIsEditingCode(false);
      if (onCodeUpdated) {
        onCodeUpdated(customCodeInput.trim().toUpperCase());
      }
    } catch (err: any) {
      setCodeError(err.message || 'Failed to update referral code');
    } finally {
      setSavingCode(false);
    }
  };

  // QR Code Rendering on Canvas
  useEffect(() => {
    if (!showQrModal || !qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(currentReferralLink)}&margin=10&color=1e293b`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = qrUrl;
  }, [showQrModal, currentReferralLink, qrSize]);

  const downloadQrCode = () => {
    if (!qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current;
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `12TestGig-Partner-QR-${referralCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Share Handlers
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(pitchUrdu);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(pitchEnglish);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentReferralLink)}&text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentReferralLink)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Join 12 Test Gig & earn by testing Android apps! Sign up with my partner link:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentReferralLink)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-zinc-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden font-sans border border-blue-500/20">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-black text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Lifetime 10% - 20% Partner Commission
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-black/40 px-3 py-1 rounded-full text-blue-200 border border-white/10 flex items-center gap-1.5">
              Unique Partner Code: <strong className="text-white font-bold">{referralCode}</strong>
            </span>
            <button
              onClick={() => setIsEditingCode(!isEditingCode)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1 border border-white/15"
              title="Customize your referral alias"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Customize Alias</span>
            </button>
          </div>
        </div>

        {/* Alias Editing Form */}
        {isEditingCode && (
          <form onSubmit={handleSaveCustomCode} className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 animate-in fade-in">
            <p className="text-xs font-bold text-blue-200 mb-2">Set Your Custom Referral Code / Slug:</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customCodeInput}
                onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. UMAR_VIP or TESTER_PRO"
                maxLength={20}
                required
                className="flex-1 bg-zinc-900/90 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingCode}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl transition disabled:opacity-50"
                >
                  {savingCode ? 'Saving...' : 'Save Code'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCode(false)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
            {codeError && <p className="text-[11px] text-red-300 mt-1 font-semibold">{codeError}</p>}
          </form>
        )}

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Your Unique Multi-Channel Partner Link
          </h2>
          <p className="text-xs md:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
            Every tester who signs up via your link becomes permanently attached to your affiliate network. You automatically earn passive commission on every completed testing task!
          </p>
        </div>

        {/* Dynamic Channel & Campaign Customizer */}
        <div className="space-y-3 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Target Channel & Campaign:</span>
            </div>

            {/* Campaign Tag Input */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-blue-200">Campaign Tag:</span>
              <input
                type="text"
                placeholder="e.g. promo-march or fb-testers"
                value={campaignTag}
                onChange={(e) => setCampaignTag(e.target.value)}
                className="bg-black/40 border border-white/20 text-white rounded-xl px-3 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-zinc-500 w-44"
              />
            </div>
          </div>

          {/* Channel Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CHANNELS.map((ch) => {
              const isActive = activeChannel === ch.id;
              const Icon = ch.icon;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? `${ch.color} border-white/40 shadow-md scale-105` 
                      : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main URL Bar & Copy Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-black/50 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3.5 text-xs text-blue-100 font-mono select-all flex items-center justify-between overflow-hidden shadow-inner">
            <span className="truncate">{currentReferralLink}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(currentReferralLink, 'link')}
              className={`px-5 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-xl shrink-0 ${
                copiedLink
                  ? 'bg-emerald-400 text-zinc-950 scale-105'
                  : 'bg-white hover:bg-zinc-100 text-zinc-950 hover:scale-102'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4 text-zinc-900" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Unique Link'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="px-3.5 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow"
              title="Share via any installed app"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="p-3.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center shrink-0"
              title="Show QR Code for scanning"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1-Click Multi-Channel Instant Share Buttons */}
        <div className="pt-2">
          <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2.5">
            Instant 1-Click Quick Share:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-black transition shadow"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow"
            >
              <Globe className="w-4 h-4" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black transition shadow border border-white/20"
            >
              <Share2 className="w-4 h-4" />
              <span>X (Twitter)</span>
            </button>
          </div>
        </div>

        {/* Ready-to-use High-Converting Marketing Pitches */}
        <div className="pt-3 border-t border-white/15">
          <p className="text-xs font-bold text-blue-100 flex items-center gap-1.5 mb-2.5">
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            Ready-Made High-Converting Social Post Templates:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Urdu Pitch */}
            <div className="bg-black/35 rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-400/20 px-2 py-0.5 rounded-md">
                  🇵🇰 Urdu / Roman Urdu Pitch (Best for WhatsApp Groups)
                </span>
                <p className="text-[11px] text-blue-100 mt-2 line-clamp-3 leading-relaxed">
                  {pitchUrdu}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(pitchUrdu, 'ur')}
                className="mt-3 w-full py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition border border-white/15"
              >
                {copiedPitchUr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitchUr ? 'Pitch Copied!' : 'Copy Urdu Message'}</span>
              </button>
            </div>

            {/* English Pitch */}
            <div className="bg-black/35 rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-400/20 px-2 py-0.5 rounded-md">
                  🌍 Global English Pitch (Best for Telegram / LinkedIn)
                </span>
                <p className="text-[11px] text-blue-100 mt-2 line-clamp-3 leading-relaxed">
                  {pitchEnglish}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(pitchEnglish, 'en')}
                className="mt-3 w-full py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition border border-white/15"
              >
                {copiedPitchEn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitchEn ? 'Pitch Copied!' : 'Copy English Message'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-zinc-900 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Your Partner QR Code</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Testers can scan this code with their phone camera to instantly register under your partner account.
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto w-fit shadow-inner">
              <canvas
                ref={qrCanvasRef}
                width={qrSize}
                height={qrSize}
                className="rounded-lg shadow-sm"
              />
            </div>

            <p className="text-[11px] font-mono text-zinc-400 mt-3 truncate px-4">
              {currentReferralLink}
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={downloadQrCode}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
