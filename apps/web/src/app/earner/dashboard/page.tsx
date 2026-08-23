'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function EarnerDashboard() {
  const metrics = [
    { title: 'Total Commission', value: '$450.00', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Network', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Completed Referrals', value: '8', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Conversion Rate', value: '65%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  return (
    <ProtectedRoute allowedRoles={['earner']}>
      <EarnerLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Partner Dashboard</h1>
            <p className="text-zinc-500 mt-1">Track your referrals and commission earnings.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.title} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500">{metric.title}</h3>
                </div>
                <p className="text-3xl font-bold text-zinc-900">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-6 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900">Grow Your Network</h2>
              <p className="text-zinc-500 mt-2 mb-6 max-w-sm">Share your unique invite link with friends. You earn a commission when they complete testing tasks.</p>
              <div className="flex w-full max-w-md items-center gap-2">
                <input type="text" readOnly value="https://12testgig.vercel.app/invite/partner-123" className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-500 font-mono" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">Copy</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-zinc-100 p-6 text-center text-zinc-500 h-full flex items-center justify-center min-h-[200px]">
                No recent referral activity found.
              </div>
            </div>
          </div>
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
