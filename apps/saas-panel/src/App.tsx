import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Organizations from './pages/Organizations';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-saas-dark text-saas-text">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/organizations" element={<Organizations />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
