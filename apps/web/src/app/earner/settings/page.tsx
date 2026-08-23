'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Bell, Shield, Building } from 'lucide-react';

export default function EarnerSettings() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['earner']}>
      <EarnerLayout>
        <div className="space-y-6 max-w-3xl">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
            <p className="text-zinc-500 mt-1">Manage your partner account preferences.</p>
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
                <p className="text-xs text-zinc-500 mt-2">Your email address is used for login and payout notifications.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-zinc-400" /> Payout Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">PayPal Email</label>
                <input type="email" placeholder="e.g. name@example.com" className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Save Details
              </button>
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
                  <p className="font-medium text-zinc-900">New Referral Alerts</p>
                  <p className="text-sm text-zinc-500">Get notified when someone signs up using your link.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              </label>
              <div className="h-px bg-zinc-100 w-full"></div>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">Commission Payouts</p>
                  <p className="text-sm text-zinc-500">Alerts when commission is added to your available balance.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              </label>
            </div>
          </div>

        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
