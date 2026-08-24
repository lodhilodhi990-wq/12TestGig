'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Rocket, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Copy,
  Check,
  Tag,
  Star,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fallbackArticles, BlogPost } from '../page';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function SingleBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const findPost = async () => {
      // 1. Check fallback
      const local = fallbackArticles.find(a => a.slug === slug);
      if (local) {
        setPost(local);
        setRelatedPosts(fallbackArticles.filter(a => a.slug !== slug).slice(0, 2));
        setLoading(false);
      }

      // 2. Query Firestore
      try {
        const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          const data = docSnap.data() as BlogPost;
          setPost({ ...data, id: docSnap.id });

          // Auto-increment view count
          try {
            updateDoc(doc(db, 'blog_posts', docSnap.id), {
              views: increment(1)
            });
          } catch (e) {
            console.warn('View counter notice:', e);
          }
        }

        // Fetch related posts
        const allSnap = await getDocs(collection(db, 'blog_posts'));
        if (!allSnap.empty) {
          const allList = allSnap.docs
            .map(d => ({ ...d.data(), id: d.id } as BlogPost))
            .filter(p => p.slug !== slug && p.published !== false)
            .slice(0, 2);
          if (allList.length > 0) {
            setRelatedPosts(allList);
          }
        }
      } catch (err) {
        console.warn('Post query error:', err);
      } finally {
        setLoading(false);
      }
    };

    findPost();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (platform: 'twitter' | 'whatsapp' | 'linkedin') => {
    if (typeof window === 'undefined' || !post) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = '';
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-xs text-slate-400">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-black text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400">The requested guide may have moved or been updated.</p>
        <Link href="/blog" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition">
          Back to All Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> All Guides
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/#instant-auth"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" /> Get 20 Testers
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Header Banner Ad */}
        <AdSenseBanner slotType="header" />

        <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8">
          {/* Category & Meta Information */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                {post.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  title="Share to Twitter / X"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-bold rounded-xl transition cursor-pointer"
                  title="Share to WhatsApp"
                >
                  WhatsApp
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
              {post.excerpt}
            </p>

            {/* Author Profile Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="font-bold text-white text-xs">{post.author}</p>
                  <p className="text-[11px] text-slate-500">Published • {post.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {post.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-slate-500" /> {(post.views || 0) + 1} views</span>
              </div>
            </div>
          </div>

          {/* Cover Hero Image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap font-sans border-t border-slate-800 pt-6">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-400" /> Tags:
              </span>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-950 text-slate-300 text-xs font-medium rounded-lg border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* In-feed Ad Banner */}
        <AdSenseBanner slotType="inFeed" />

        {/* Embedded Call to Action Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-full">
              Google Play Closed Testing
            </span>
            <h3 className="text-2xl font-black text-white">Ready to Pass Closed Testing?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Get 20 verified Android testers matched to your Google Group within minutes. 14 continuous days with 100% human telemetry.
            </p>
          </div>

          <Link
            href="/#instant-auth"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            Launch 20 Testers Track <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Guides Recommendation Widget */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> Recommended Related Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(rel => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 bg-slate-950 text-blue-400 text-[10px] font-bold rounded-md border border-slate-800">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="text-[11px] text-blue-400 font-bold flex items-center gap-1 pt-2 border-t border-slate-800/80">
                    Read Guide <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-xs text-slate-500 text-center">
        <p>© 2026 12 Test Gig Inc. All rights reserved. • <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link> • <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link></p>
      </footer>
    </div>
  );
}
