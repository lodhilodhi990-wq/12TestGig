import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            12 Test Gig
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-zinc-400 hover:text-white transition">Sign In</Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            The Ultimate App <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Testing Ecosystem
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Guaranteed 20 testers for 14 days. Pass Google Play policies, get real feedback, and launch your app with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center justify-center gap-2 transition">
              Launch Your App <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/tester/dashboard" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-semibold border border-zinc-800 transition">
              Become a Tester
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-white/5 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Guaranteed 20 Testers</h3>
              <p className="text-zinc-400">We manage the entire 14-day closed testing process required by Google Play to ensure your app is ready.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Transactions</h3>
              <p className="text-zinc-400">Your funds are held securely in escrow and only released when the 14-day testing period is successfully completed.</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast Setup</h3>
              <p className="text-zinc-400">Submit your app in minutes. Our platform automatically assigns quality-checked testers to your campaign.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
