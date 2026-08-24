import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Search
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AdminBlogPost {
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

export default function BlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Google Play Strategy');
  const [author, setAuthor] = useState('12 Test Gig Team');
  const [readTime, setReadTime] = useState('5 min read');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        const list: AdminBlogPost[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AdminBlogPost));
        setPosts(list);
        setLoading(false);
      }, (err) => {
        console.warn('Blog posts listener error:', err);
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('Google Play Strategy');
    setAuthor('12 Test Gig Team');
    setReadTime('5 min read');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800');
    setPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (p: AdminBlogPost) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setAuthor(p.author);
    setReadTime(p.readTime);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.coverImage || '');
    setPublished(p.published);
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
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
      await setDoc(doc(db, 'blog_posts', docId), {
        id: docId,
        slug,
        title,
        excerpt,
        content,
        category,
        author,
        readTime,
        coverImage,
        published,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp()
      }, { merge: true });

      setShowModal(false);
      alert(editingId ? 'Blog Post updated successfully!' : 'New Blog Post published live!');
    } catch (err) {
      console.error('Failed to save blog post:', err);
      alert('Error saving post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            SEO Blog & Marketing CMS Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Write, publish, and optimize blog guides that rank on Google and attract Android developers to 12 Test Gig.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Article
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Articles</span>
          <p className="text-2xl font-black text-white mt-1">{posts.length} Guides</p>
          <p className="text-xs text-slate-500 mt-0.5">Live content published on /blog</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Published Status</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {posts.filter(p => p.published).length} Active
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Indexing on Google Search</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monetization</span>
          <p className="text-2xl font-black text-amber-400 mt-1">AdSense Ready</p>
          <p className="text-xs text-slate-500 mt-0.5">Responsive ad slots injected</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, slug, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading blog articles...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-600 stroke-1" />
            <p className="font-bold text-white">No custom articles yet</p>
            <p className="text-[11px] text-slate-500">Click "Create New Article" to add custom posts that override default templates.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author & Read Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.coverImage && (
                          <img src={p.coverImage} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-white leading-snug">{p.title}</p>
                          <p className="text-[10px] text-blue-400 font-mono mt-0.5">/blog/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      <p className="font-semibold text-white">{p.author}</p>
                      <p>{p.readTime}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600/30 text-red-400 rounded-lg transition cursor-pointer"
                          title="Delete Post"
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

      {/* Create / Edit Article Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingId ? 'Edit Blog Article' : 'Create New SEO Article'}
                </h3>
                <p className="text-xs text-slate-400">Published live to /blog for user acquisition and AdSense monetization.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Pass Google Play 20 Testers Rule"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="how-to-pass-google-play-20-testers"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-blue-400 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Google Play Strategy">Google Play Strategy</option>
                    <option value="Tester Guides">Tester Guides</option>
                    <option value="Developer Best Practices">Developer Best Practices</option>
                    <option value="App Monetization">App Monetization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-xxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Short Excerpt / SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence summary displayed on Google Search and blog index."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Article Body Content (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full guide here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="pub" className="text-xs font-bold text-white cursor-pointer">
                  Publish Live to /blog immediately
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
