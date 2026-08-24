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
  ShieldCheck
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fallbackArticles, BlogPost } from '../page';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function SingleBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const findPost = async () => {
      // 1. Check fallback
      const local = fallbackArticles.find(a => a.slug === slug);
      if (local) {
        setPost(local);
        setLoading(false);
      }

      // 2. Query Firestore
      try {
        const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data() as BlogPost;
          setPost({ ...data, id: snap.docs[0].id });
        }
      } catch (err) {
        console.warn('Post query error:', err);
      } finally {
        setLoading(false);
      }
    };

    findPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-xs text-zinc-400">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800">Article Not Found</h2>
        <Link href="/blog" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Top Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" /> All Guides
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Get 20 Testers Now
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <AdSenseBanner slotType="header" />

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm space-y-6">
          {/* Category & Meta */}
          <div className="space-y-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-zinc-900 leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium pt-2 border-b border-zinc-100 pb-4">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-zinc-500" /> {post.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {post.readTime}</span>
              <span>•</span>
              <span>Published {post.createdAt}</span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-sm h-72 md:h-96">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Body Content */}
          <div className="text-zinc-700 text-xs md:text-sm leading-relaxed space-y-4 pt-4 whitespace-pre-line font-normal">
            {post.content}
          </div>

          {/* In-article AdSense Banner */}
          <AdSenseBanner slotType="inFeed" />

          {/* Action CTA Box */}
          <div className="mt-10 p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                100% Guaranteed Approval
              </span>
              <h3 className="text-lg md:text-xl font-black mt-2">Need 20 Testers for 14 Continuous Days?</h3>
              <p className="text-xs text-blue-100 mt-1 max-w-md">
                Launch your test on 12 Test Gig. Verified real human testers test your app daily so you pass Google Play production review easily.
              </p>
            </div>
            <Link
              href="/register"
              className="px-6 py-3 bg-white hover:bg-zinc-100 text-blue-700 font-extrabold text-xs rounded-2xl shadow-lg transition whitespace-nowrap flex items-center gap-2"
            >
              Start 14-Day Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
