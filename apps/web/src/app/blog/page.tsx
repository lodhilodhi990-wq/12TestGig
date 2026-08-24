'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight, 
  Search, 
  Clock, 
  User, 
  Sparkles, 
  Rocket, 
  ShieldCheck, 
  Coins,
  ArrowLeft
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdSenseBanner from '@/components/AdSenseBanner';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
}

export const fallbackArticles: BlogPost[] = [
  {
    id: 'art-1',
    slug: 'pass-google-play-20-testers-14-days-rule',
    title: 'How to Pass the Google Play 20 Testers for 14 Days Rule in 2026',
    excerpt: 'Complete developer breakdown of Google Play closed testing requirements, avoiding tester dropouts, and answering production evaluation questions.',
    content: `## Google Play's 20-Tester Closed Testing Policy

In November 2023, Google introduced a policy requiring all new personal developer accounts to run a closed test with at least **20 opted-in testers for at least 14 continuous days** before applying for production access.

### Why Do Most Developers Get Rejected?
1. **Tester Inactivity:** Testers download the app on Day 1 and never open it again. Google monitors daily telemetry.
2. **High Drop-off Rate:** If 5 testers uninstall the app on Day 8, your active tester count drops below 20, resetting the 14-day clock.
3. **Weak Answers on Evaluation Form:** Developers fail to provide actionable feedback logs when applying for production access.

### How 12 Test Gig Solves This
With **12 Test Gig**, certified testers check in daily on real physical Android devices, providing genuine feedback, crash logs, and UX reviews.`,
    category: 'Google Play Strategy',
    author: 'Omar Farooq',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800',
    published: true,
    createdAt: '2026-08-20'
  },
  {
    id: 'art-2',
    slug: 'earn-money-testing-android-apps-pakistan',
    title: 'Earn Real Cash Testing Android Apps: Complete Beginner Guide',
    excerpt: 'Discover how mobile users in Pakistan and worldwide earn daily coins testing apps and cashing out via JazzCash, Easypaisa, or USDT.',
    content: `## Becoming a Certified App Tester

Android app developers need real users to test their new mobile games, utility tools, and SaaS apps before public release on Google Play.

### How You Get Paid
1. **Join Open Tests:** Explore available apps on 12 Test Gig.
2. **Daily Testing Tasks:** Open the app, explore features, and submit a quick screenshot proof.
3. **Earn Coins & Cashout:** Withdraw your earnings directly to JazzCash, Easypaisa, SadaPay, or USDT.`,
    category: 'Tester Guides',
    author: 'Ali Raza',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&q=80&w=800',
    published: true,
    createdAt: '2026-08-22'
  },
  {
    id: 'art-3',
    slug: 'avoid-google-play-console-account-termination',
    title: 'Top 5 Closed Testing Mistakes That Cause Play Console Rejections',
    excerpt: 'Crucial checklist for indie developers to protect their developer account and pass production review on the very first attempt.',
    content: `## Avoiding Common Closed Testing Pitfalls

Passing closed testing is not just about the number of testers; it's about adhering strictly to Google Play developer quality guidelines.

### Crucial Best Practices
- Keep your target SDK version updated to the latest Android API.
- Ensure your privacy policy covers all permissions requested by the APK.
- Gather authentic bug reports to answer the 3 production evaluation questions.`,
    category: 'Developer Best Practices',
    author: 'Tech Desk',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    published: true,
    createdAt: '2026-08-24'
  }
];

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackArticles);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    try {
      const q = query(collection(db, 'blog_posts'));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const list: BlogPost[] = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as BlogPost))
            .filter(p => p.published !== false);
          
          if (list.length > 0) {
            setPosts(list);
          }
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Blog posts fetch notice', e);
    }
  }, []);

  const categories = ['All', 'Google Play Strategy', 'Tester Guides', 'Developer Best Practices'];

  const filtered = posts.filter(p => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Top Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> Back to 12 Test Gig
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Get 20 Testers
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-200 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
            12 Test Gig Knowledge & Growth Hub
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Google Play Testing Guides & Earning Insights
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto">
            Expert strategies to pass Google Play 14-day closed testing, optimize your Android apps, and maximize tester earnings.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search articles, guides, tutorials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-300 rounded-2xl text-xs font-semibold text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* AdSense Top Slot */}
        <AdSenseBanner slotType="header" />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {article.coverImage && (
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold">
                      {article.category}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-zinc-900 group-hover:text-blue-600 transition leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>

        {/* In-feed Ad Banner */}
        <AdSenseBanner slotType="inFeed" />
      </main>
    </div>
  );
}
