'use client';
import React, { useEffect, useState } from 'react';
import { subscribeToAdSenseConfig, AdSenseConfig, defaultAdSenseConfig } from '@/lib/adsense';

interface AdSenseBannerProps {
  slotType: 'header' | 'inFeed' | 'sidebar';
  className?: string;
}

export default function AdSenseBanner({ slotType, className = '' }: AdSenseBannerProps) {
  const [config, setConfig] = useState<AdSenseConfig>(defaultAdSenseConfig);

  useEffect(() => {
    const unsub = subscribeToAdSenseConfig((newConfig) => {
      setConfig(newConfig);
    });
    return () => unsub();
  }, []);

  if (!config.enabled || !config.publisherId) {
    return null; // Do not render if AdSense is disabled in SaaS panel
  }

  const customSnippet = 
    slotType === 'header' ? config.headerBannerCode :
    slotType === 'inFeed' ? config.inFeedCode :
    config.sidebarCode;

  if (customSnippet) {
    return (
      <div 
        className={`my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 p-2 ${className}`}
        dangerouslySetInnerHTML={{ __html: customSnippet }}
      />
    );
  }

  return (
    <div className={`my-4 w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 text-center ${className}`}>
      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Advertisement</span>
      <div className="w-full h-24 sm:h-28 bg-gradient-to-r from-zinc-100 via-zinc-200/50 to-zinc-100 rounded-xl flex items-center justify-center text-xs font-mono text-zinc-400">
        Google AdSense Responsive Unit ({slotType})
      </div>
    </div>
  );
}
