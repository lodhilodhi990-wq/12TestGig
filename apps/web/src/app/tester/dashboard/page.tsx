'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import TesterLayout from '@/components/TesterLayout';
import { DollarSign, CheckCircle2, Star, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TesterDashboard() {
  // Placeholder Data for UI Display
  const metrics = [
    { title: 'Total Earned', value: '$120.00', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Tests', value: '2', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Quality Score', value: '4.8/5', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
    { title: 'Completed', value: '15', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const activeTests = [
    { id: 1, name: 'Fitness Tracker Pro', daysLeft: 4, status: 'In Progress', reward: '$15' },
    { id: 2, name: 'Language Learner', daysLeft: 12, status: 'Just Started', reward: '$20' },
  ];

  const availableCampaigns = [
    { id: 3, name: 'Crypto Wallet App', category: 'Finance', reward: '$25', slots: 3 },
    { id: 4, name: 'Food Delivery Service', category: 'Lifestyle', reward: '$15', slots: 8 },
    { id: 5, name: 'Meditation Plus', category: 'Health', reward: '$12', slots: 12 },
  ];

  return (
    <ProtectedRoute allowedRoles={['tester']}>
      <TesterLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Welcome back!</h1>
            <p className="text-zinc-500 mt-1">Here is what's happening with your testing tasks today.</p>
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
            {/* Active Tests */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900">My Active Tests</h2>
                <Link href="/tester/tests" className="text-sm text-blue-600 font-medium hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {activeTests.map((test) => (
                  <div key={test.id} className="p-6 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-zinc-900">{test.name}</h3>
                      <span className="font-semibold text-emerald-600">{test.reward}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {test.daysLeft} days remaining
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-xs">
                        {test.status}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-zinc-100 rounded-full h-2 mt-4 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${((14 - test.daysLeft) / 14) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {activeTests.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">
                    You have no active tests right now.
                  </div>
                )}
              </div>
            </div>

            {/* Available Campaigns */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-lg font-bold text-zinc-900">Available to Test</h2>
                <p className="text-sm text-zinc-500 mt-1">Apply now to earn rewards</p>
              </div>
              <div className="divide-y divide-zinc-100">
                {availableCampaigns.map((camp) => (
                  <div key={camp.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <div>
                      <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{camp.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded">{camp.category}</span>
                        <span>{camp.slots} slots left</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{camp.reward}</div>
                        <div className="text-xs text-zinc-400">Reward</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TesterLayout>
    </ProtectedRoute>
  );
}
