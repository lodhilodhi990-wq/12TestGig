import { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  User, 
  TrendingUp, 
  Star, 
  Filter, 
  Upload, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AdminBlogPost {
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
  metaTitle?: string;
  metaDesc?: string;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_BLOG_POSTS: AdminBlogPost[] = [
  {
    id: 'art-1',
    slug: 'pass-google-play-20-testers-14-days-rule',
    title: 'How to Pass the Google Play 20 Testers for 14 Days Rule in 2026',
    excerpt: 'Complete developer breakdown of Google Play closed testing requirements, avoiding tester dropouts, and answering production evaluation questions.',
    content: `## Google Play's 20-Tester Closed Testing Policy

In November 2023, Google introduced a strict policy requiring all new personal developer accounts to run a closed test with at least **20 opted-in testers for at least 14 continuous days** before applying for production access.

### Why Do Most Developers Get Rejected?
1. **Tester Inactivity:** Testers download the app on Day 1 and never open it again. Google monitors daily telemetry and active user sessions.
2. **High Drop-off Rate:** If 5 testers uninstall the app on Day 8, your active tester count drops below 20, resetting the 14-day clock.
3. **Weak Answers on Evaluation Form:** Developers fail to provide actionable feedback logs when answering Google's 3 production evaluation questions.

### The 4 Pillars to Guaranteed Production Approval

1. **Maintain 20+ Active Physical Devices:** Never rely on friends or emulator bots. Google's automated systems detect duplicate Device IDs.
2. **Daily User Interaction:** Testers should spend at least 3-5 minutes inside the app every single day across the 14 days.
3. **Document Real Bugs & Fixes:** Save bug reports, crash telemetry, and UI suggestions so you can quote them in your production application.
4. **Collect Actionable Feedback:** Use in-app rating prompts or Google Group discussions to prove meaningful engagement.

### How 12 Test Gig Automates Your Approval
With **12 Test Gig**, 20 certified Android testers are matched to your Google Group within minutes. Our platform enforces:
- 24-hour daily return check-ins.
- Anti-duplicate screenshot verification.
- Comprehensive telemetry reports ready to paste into your Google Play Console evaluation form.`,
    category: 'Google Play Strategy',
    author: 'Omar Farooq',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: true,
    views: 1420,
    tags: ['Google Play', 'Closed Testing', '20 Testers', 'Android Dev'],
    metaTitle: 'How to Pass Google Play 20 Testers Rule (2026 Guide)',
    metaDesc: 'Step-by-step guide to passing the Google Play 20 testers for 14 continuous days closed testing requirement.',
    createdAt: '2026-08-20'
  },
  {
    id: 'art-2',
    slug: 'earn-money-testing-android-apps-pakistan',
    title: 'Earn Real Cash Testing Android Apps: Complete Beginner Guide',
    excerpt: 'Discover how mobile users in Pakistan and worldwide earn daily coins testing apps and cashing out via JazzCash, Easypaisa, SadaPay, or USDT.',
    content: `## Becoming a Certified App Tester

Android app developers need real users to test their new mobile games, utility tools, and SaaS apps before public release on Google Play. Developers pay for genuine human feedback, bug reports, and daily interaction.

### How You Get Paid on 12 Test Gig
1. **Join Open Tests:** Explore available apps in your tester dashboard.
2. **Daily Testing Tasks:** Open the assigned app, test features for 3-5 minutes, and submit a quick screenshot proof.
3. **Earn Coins Daily:** Get 100 to 300 Coins for every validated daily check-in.
4. **14-Day Completion Bonus:** Receive a massive bonus payout (up to 600+ coins) when you complete all 14 consecutive days.
5. **Instant Cashout:** Withdraw your accumulated coins directly to **JazzCash, Easypaisa, SadaPay, Local Bank (Raast), or USDT Crypto**.

### Top Tips for Maximum Earnings
- Never miss a day! Missing a day can lose you your 14-day completion streak bonus.
- Report real bugs with detailed steps to earn tester reputation badges and unlock VIP high-paying campaigns.
- Keep your Android OS updated to qualify for new premium app tests.`,
    category: 'Tester Guides',
    author: 'Ali Raza',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: false,
    views: 980,
    tags: ['Earn Money', 'App Testing', 'JazzCash', 'Easypaisa', 'Mobile Jobs'],
    metaTitle: 'Earn Real Money Testing Android Apps (JazzCash / Easypaisa)',
    metaDesc: 'Learn how to test mobile apps 3-5 minutes daily and withdraw cash directly to Pakistani mobile wallets and crypto.',
    createdAt: '2026-08-22'
  },
  {
    id: 'art-3',
    slug: 'avoid-google-play-console-account-termination',
    title: 'Top 5 Closed Testing Mistakes That Cause Play Console Rejections',
    excerpt: 'Crucial checklist for indie developers to protect their developer account and pass production review on the very first attempt.',
    content: `## Avoiding Common Closed Testing Pitfalls

Passing closed testing is not just about having 20 email addresses in an opt-in list. Google's review algorithm inspects actual user engagement telemetry, crash rates, and privacy compliance.

### 1. Bot & Farm Emulators
Using bot farms or clicker scripts triggers Google's automated anti-spam radar. Google logs device hardware fingerprints, battery levels, accelerometer data, and Android system builds. Always test on real physical phones.

### 2. Broken Privacy Policy & Permissions
If your app requests Sensitive Permissions (e.g., Background Location, Camera, SMS, Storage) without explaining them in your Privacy Policy and Play Console declarations, rejection is guaranteed.

### 3. Ignoring Feedback in Production Answers
When applying for production, Google asks: *"What feedback did you collect during closed testing and what changes did you make?"*
If you answer with generic text like *"No bugs found, app is ready"*, your submission will likely be rejected. Provide specific bug fixes, UI adjustments, and device compatibility improvements.

### 4. High Crash Rates on Minimum SDK
Ensure your app doesn't crash on older Android versions or devices with low RAM (2GB - 3GB).

### 5. Sudden Tester Dropouts
If testers uninstall your app during the 14 days, your active count drops. Ensure you maintain 20+ testers continuously.`,
    category: 'Developer Best Practices',
    author: 'Tech Desk',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    published: true,
    featured: false,
    views: 1150,
    tags: ['Google Console', 'Indie Dev', 'Play Store Policy', 'App Launch'],
    metaTitle: 'Top 5 Closed Testing Mistakes on Google Play (Indie Dev Checklist)',
    metaDesc: 'Protect your Google Play Console account from rejections with these 5 essential closed testing rules.',
    createdAt: '2026-08-24'
  }
];

const PRESET_IMAGES = [
  { label: 'Google Play & Android', url: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Mobile App Testing', url: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Coding & Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Developer Workspace', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Mobile Device Farm', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Financial & Wallet', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200' },
];

export default function BlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isSeeding, setIsSeeding] = useState(false);

  // Editor Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'seo'>('edit');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Post Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Google Play Strategy');
  const [author, setAuthor] = useState('12 Test Gig Team');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const [readTime, setReadTime] = useState('5 min read');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('Google Play, Android, Closed Testing');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync / Listen to Firestore collection
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed default articles on first visit so admin sees them immediately!
          autoSeedDefaultPosts();
        } else {
          const list: AdminBlogPost[] = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          } as AdminBlogPost));
          setPosts(list);
          setLoading(false);
        }
      }, (err) => {
        console.warn('Blog posts listener error:', err);
        setPosts(DEFAULT_BLOG_POSTS);
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
      setPosts(DEFAULT_BLOG_POSTS);
      setLoading(false);
    }
  }, []);

  const autoSeedDefaultPosts = async () => {
    try {
      setIsSeeding(true);
      const batch = writeBatch(db);
      for (const art of DEFAULT_BLOG_POSTS) {
        const ref = doc(db, 'blog_posts', art.id);
        batch.set(ref, {
          ...art,
          createdAt: art.createdAt || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();
    } catch (e) {
      console.warn('Auto seed fallback:', e);
      setPosts(DEFAULT_BLOG_POSTS);
    } finally {
      setIsSeeding(false);
      setLoading(false);
    }
  };

  const handleManualSeed = async () => {
    if (!confirm('This will populate or restore default SEO blog guides in the database. Continue?')) return;
    await autoSeedDefaultPosts();
    alert('Default articles synchronized successfully!');
  };

  // Auto calculate Read Time based on content length
  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('Google Play Strategy');
    setAuthor('12 Test Gig Team');
    setAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
    setReadTime('5 min read');
    setExcerpt('');
    setContent(`## Introduction
Write your article introduction here...

### Key Takeaways
- Point 1
- Point 2
- Point 3

### Detailed Breakdown
Explain your insights with practical advice for Android developers and testers.`);
    setCoverImage(PRESET_IMAGES[0].url);
    setPublished(true);
    setFeatured(false);
    setTagsInput('Google Play, Android, Closed Testing');
    setMetaTitle('');
    setMetaDesc('');
    setActiveTab('edit');
    setShowModal(true);
  };

  const handleOpenEdit = (p: AdminBlogPost) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setAuthor(p.author);
    setAuthorAvatar(p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
    setReadTime(p.readTime || calculateReadTime(p.content));
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.coverImage || PRESET_IMAGES[0].url);
    setPublished(p.published);
    setFeatured(p.featured || false);
    setTagsInput(p.tags ? p.tags.join(', ') : 'Google Play, Android, Testing');
    setMetaTitle(p.metaTitle || p.title);
    setMetaDesc(p.metaDesc || p.excerpt);
    setActiveTab('edit');
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setMetaTitle(`${val} | 12 Test Gig`);
    }
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setReadTime(calculateReadTime(val));
    if (!excerpt && val.length > 30) {
      setExcerpt(val.slice(0, 150).replace(/[#*`_]/g, '') + '...');
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + `\n${prefix}Text${suffix}\n`);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      alert('Please fill out Title, Slug, and Content.');
      return;
    }
    setSaving(true);

    try {
      const docId = editingId || `post_${Date.now()}`;
      const tagList = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const payload = {
        id: docId,
        slug: slug.trim(),
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category,
        author: author.trim(),
        authorAvatar,
        readTime: readTime || calculateReadTime(content),
        coverImage,
        published,
        featured,
        tags: tagList,
        metaTitle: metaTitle || `${title} | 12 Test Gig`,
        metaDesc: metaDesc || excerpt,
        views: editingId ? (posts.find(p => p.id === editingId)?.views || 0) : 0,
        createdAt: editingId ? (posts.find(p => p.id === editingId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'blog_posts', docId), payload, { merge: true });
      setShowModal(false);
      alert('Blog article saved and published successfully!');
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert('Failed to save post: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Could not delete post: ' + err.message);
    }
  };

  const handleTogglePublish = async (p: AdminBlogPost) => {
    try {
      await setDoc(doc(db, 'blog_posts', p.id), {
        published: !p.published,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (p: AdminBlogPost) => {
    try {
      await setDoc(doc(db, 'blog_posts', p.id), {
        featured: !p.featured,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  // Image Upload (Base64 compression for 100% Free Firebase Plan)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setCoverImage(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.author.toLowerCase().includes(search.toLowerCase()) ||
                          p.slug.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' ? true :
                          selectedStatus === 'Published' ? p.published :
                          selectedStatus === 'Draft' ? !p.published :
                          selectedStatus === 'Featured' ? p.featured : true;
      return matchSearch && matchCat && matchStatus;
    });
  }, [posts, search, selectedCategory, selectedStatus]);

  const categories = ['All', 'Google Play Strategy', 'Tester Guides', 'Developer Best Practices', 'Case Studies', 'Product Updates'];

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            SEO Blog & Developer Guides Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Write, edit, and publish high-ranking articles for Google search traffic and developer trust.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualSeed}
            disabled={isSeeding}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Restore default articles to database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            Sync Default Articles
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Total Articles
          </span>
          <p className="text-2xl font-black text-white font-mono">{posts.length}</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Published Live
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {posts.filter(p => p.published).length}
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" /> Featured Pinned
          </span>
          <p className="text-2xl font-black text-amber-400 font-mono">
            {posts.filter(p => p.featured).length}
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Total Article Views
          </span>
          <p className="text-2xl font-black text-indigo-400 font-mono">
            {posts.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Status</option>
              <option value="Published" className="bg-slate-900">Published Only</option>
              <option value="Draft" className="bg-slate-900">Drafts Only</option>
              <option value="Featured" className="bg-slate-900">Featured Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. ARTICLES TABLE / LIST */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading blog articles...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No blog posts found</p>
            <p className="text-xs text-slate-400">Click "Sync Default Articles" or create your first post.</p>
            <button
              onClick={handleManualSeed}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync 3 Default SEO Articles
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-5">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={post.coverImage || PRESET_IMAGES[0].url}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-xs max-w-sm line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>/{post.slug}</span>
                            <span>•</span>
                            <span className="text-slate-400">{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-slate-800 text-blue-400 rounded-lg text-[10px] font-bold border border-slate-700/80">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-slate-300 font-semibold">{post.author}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-slate-300 font-bold">
                        {(post.views || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                          post.published 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-1.5 rounded-xl transition cursor-pointer ${
                          post.featured 
                            ? 'text-amber-400 bg-amber-400/10' 
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={post.featured ? 'Featured on Top' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${post.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://12-test-gig.vercel.app/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                          title="View on Live Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 bg-slate-800 hover:bg-blue-600/30 text-blue-400 rounded-xl transition cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-2 bg-slate-800 hover:bg-red-600/30 text-red-400 rounded-xl transition cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ADVANCED BLOG POST EDITOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  {editingId ? 'Edit Article' : 'Write New SEO Guide'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish markdown content optimized for search engines and user conversion.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SEO & Meta
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="space-y-5 text-xs">
              {activeTab === 'edit' && (
                <div className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. How to Pass the Google Play 20 Testers Rule in 2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. pass-google-play-20-testers"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-blue-400 font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Category, Author, Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                        Reading Time
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                      Excerpt / Summary (Shown in Index Card)
                    </label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Short 2-sentence summary explaining why developers or testers should read this..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Markdown Quick Formatting Toolbar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                        Article Body (Markdown Supported)
                      </label>
                      <div className="flex items-center gap-1 text-[11px] font-mono">
                        <button type="button" onClick={() => insertMarkdown('## ')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">H2</button>
                        <button type="button" onClick={() => insertMarkdown('### ')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">H3</button>
                        <button type="button" onClick={() => insertMarkdown('**', '**')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">Bold</button>
                        <button type="button" onClick={() => insertMarkdown('- ')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">List</button>
                        <button type="button" onClick={() => insertMarkdown('> ')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">Quote</button>
                        <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">Code</button>
                      </div>
                    </div>

                    <textarea
                      rows={10}
                      required
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Write your article in Markdown..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  {/* Cover Image & Presets */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                      Cover Image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                      <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Preset Gallery */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            coverImage === preset.url
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 max-h-[500px] overflow-y-auto">
                  {coverImage && (
                    <img src={coverImage} alt={title} className="w-full h-56 object-cover rounded-2xl border border-slate-800" />
                  )}
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg">
                      {category}
                    </span>
                    <h1 className="text-2xl font-black text-white">{title || 'Untitled Article'}</h1>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{excerpt}</p>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border-t border-slate-800 pt-4">
                    {content}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4">
                  {/* Google SERP Preview Card */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 font-sans">
                    <span className="text-[10px] text-slate-500 font-mono">https://12-test-gig.vercel.app/blog/{slug || 'article-slug'}</span>
                    <h4 className="text-sm font-bold text-blue-400 hover:underline line-clamp-1">{metaTitle || title || 'Article Title'}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{metaDesc || excerpt || 'Article description will appear in Google search results.'}</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                      Meta Title ({metaTitle.length}/60 chars)
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Title tag for search engines"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                      Meta Description ({metaDesc.length}/160 chars)
                    </label>
                    <textarea
                      rows={2}
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      placeholder="Meta description for search engines..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                      Keywords / Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Google Play, Closed Testing, 20 Testers, Android"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Publication Status & Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Publish Article (Live on Site)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Pin as Featured Article</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? 'Saving...' : 'Save & Publish'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
