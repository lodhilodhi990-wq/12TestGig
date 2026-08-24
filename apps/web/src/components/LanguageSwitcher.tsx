'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/lib/i18n';

const LANG_OPTIONS: { code: LanguageCode; label: string; flag: string; sub: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', sub: 'Default' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', sub: 'Urdu Script' },
  { code: 'ru', label: 'Roman Urdu', flag: '🇵🇰', sub: 'Easy Urdu' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANG_OPTIONS.find(o => o.code === lang) || LANG_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
        title="Change Language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="font-semibold">{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in duration-150">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-400" /> Select Language
          </div>
          <div className="space-y-1 pt-1">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLang(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  lang === opt.code
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{opt.flag}</span>
                  <div>
                    <p className="leading-none">{opt.label}</p>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{opt.sub}</p>
                  </div>
                </div>
                {lang === opt.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
