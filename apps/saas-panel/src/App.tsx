import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import Disputes from './pages/Disputes';
import Settings from './pages/Settings';
import Deposits from './pages/Deposits';
import Campaigns from './pages/Campaigns';
import Withdrawals from './pages/Withdrawals';
import Login from './pages/Login';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading SaaS Console...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/*" 
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/deposits" element={<Deposits />} />
                <Route path="/withdrawals" element={<Withdrawals />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/disputes" element={<Disputes />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
