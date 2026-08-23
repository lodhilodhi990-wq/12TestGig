'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import TesterLayout from '@/components/TesterLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Bell, Shield, Smartphone } from 'lucide-react';

export default function TesterSettings() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['tester']}>
      <TesterLayout>
        <div className="space-y-6 max-w-3xl">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
            <p className="text-zinc-500 mt-1">Manage your account preferences and devices.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" /> Profile Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Mail className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      disabled 
                      value={user?.email || ''} 
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500" 
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Your email address is used for login and notifications.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-zinc-400" /> Testing Devices
              </h2>
            </div>
            <div className="p-6">
              <div className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Google Pixel 7</p>
                    <p className="text-xs text-zinc-500">Android 14</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Primary</span>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:underline">+ Add new device</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-zinc-400" /> Notifications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">New Campaign Alerts</p>
                  <p className="text-sm text-zinc-500">Get notified when apps matching your devices need testing.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              </label>
              <div className="h-px bg-zinc-100 w-full"></div>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">Task Reminders</p>
                  <p className="text-sm text-zinc-500">Daily reminders to complete your active testing tasks.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              </label>
            </div>
          </div>

        </div>
      </TesterLayout>
    </ProtectedRoute>
  );
}
