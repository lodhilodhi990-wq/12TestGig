import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import Disputes from './pages/Disputes';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-saas-bg text-saas-text font-sans selection:bg-saas-accent/30">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/disputes" element={<Disputes />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
