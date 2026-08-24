'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowLeft,
  Star,
  Eye,
  Tag,
  TrendingUp,
  Flame
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
  authorAvatar?: string;
  readTime: string;
  coverImage?: string;
  published: boolean;
  featured?: boolean;
  views?: number;
  tags?: string[];
  createdAt: string;
}

export const fallbackArticles: BlogPost[] = [
  {
    id: 'art-1',
    slug: 'pass-google-play-20-testers-14-days-rule',
    title: 'How to Pass the Google Play 20 Testers for 14 Days Rule in 2026',
    excerpt: 'Complete developer breakdown of Google Play closed testing requirements, avoiding tester dropouts, and answering production evaluation questions.',
    content: `## Google Play's 20-Tester Closed Testing Policy...`,
    category: 'Google Play Strategy',
    author: 'Omar Farooq',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: true,
    views: 1420,
    tags: ['Google Play', 'Closed Testing', '20 Testers'],
    createdAt: '2026-08-20'
  },
  {
    id: 'art-2',
    slug: 'earn-money-testing-android-apps-pakistan',
    title: 'Earn Real Cash Testing Android Apps: Complete Beginner Guide',
    excerpt: 'Discover how mobile users in Pakistan and worldwide earn daily coins testing apps and cashing out via JazzCash, Easypaisa, or USDT.',
    content: `## Becoming a Certified App Tester...`,
    category: 'Tester Guides',
    author: 'Ali Raza',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: false,
    views: 980,
    tags: ['Earn Money', 'App Testing', 'JazzCash'],
    createdAt: '2026-08-22'
  },
  {
    id: 'art-3',
    slug: 'avoid-google-play-console-account-termination',
    title: 'Top 5 Closed Testing Mistakes That Cause Play Console Rejections',
    excerpt: 'Crucial checklist for indie developers to protect their developer account and pass production review on the very first attempt.',
    content: `## Avoiding Common Closed Testing Pitfalls...`,
    category: 'Developer Best Practices',
    author: 'Tech Desk',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: false,
    views: 1150,
    tags: ['Google Console', 'Indie Dev', 'Play Store Policy'],
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    posts.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [posts, search, selectedCat]);

  const featuredPost = useMemo(() => {
    return posts.find(p => p.featured) || posts[0];
  }, [posts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">12 Test Gig</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                SEO Blog & Guides
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link 
              href="/#instant-auth" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition shadow-md shadow-blue-600/20"
            >
              Get 20 Testers
            </Link>
          </div>
        </div>
      </header>

      {/* AdSense Slot */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <AdSenseBanner slotType="header" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header Title & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Official Play Console & Testing Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Google Play Closed Testing & Earning Knowledge Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Expert articles, developer checklists, and tester earning strategies to help you pass Google Play production review guaranteed.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, policies, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCat === c
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* FEATURED PINNED ARTICLE HERO CARD */}
        {featuredPost && selectedCat === 'All' && !search && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 group hover:border-blue-500/50 transition">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Featured Guide
                    </span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-black text-white hover:text-blue-400 transition leading-tight">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img 
                      src={featuredPost.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                      alt={featuredPost.author} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                    />
                    <div className="text-[11px]">
                      <p className="font-bold text-white">{featuredPost.author}</p>
                      <p className="text-slate-500">{featuredPost.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {featuredPost.readTime}
                    </span>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-600/20"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                <img
                  src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200'}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map(post => (
            <article 
              key={post.id} 
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition group shadow-xl"
            >
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-blue-400 text-[10px] font-bold rounded-lg border border-slate-800">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(post.views || 0).toLocaleString()} views</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-base font-black text-white group-hover:text-blue-400 transition leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-normal">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-400 text-[9px] font-medium rounded-md border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={post.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-slate-300 font-semibold text-[11px]">{post.author}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 text-xs"
                >
                  Read <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* In-feed AdSense */}
        <div className="pt-8">
          <AdSenseBanner slotType="inFeed" />
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Need 20 Verified Testers for Your App?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Join thousands of Android developers who pass closed testing on their first attempt with 12 Test Gig. 100% human telemetry.
            </p>
          </div>
          <Link
            href="/#instant-auth"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition whitespace-nowrap flex items-center gap-2"
          >
            Launch Your 20 Testers Track <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-xs text-slate-500 text-center">
        <p>© 2026 12 Test Gig Inc. All rights reserved. • <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link> • <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link></p>
      </footer>
    </div>
  );
}
