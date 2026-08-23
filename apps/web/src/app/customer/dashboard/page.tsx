'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { LayoutDashboard, Users, Activity, CreditCard, ArrowUpRight, Plus, Coins } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const stats = [
    { label: 'Active Campaigns', value: '3', icon: Activity, trend: '+2 this week' },
    { label: 'Total Testers', value: '45', icon: Users, trend: '+12 this week' },
    { label: 'Total Spent', value: '15,000 🪙', icon: Coins, trend: '≈ 15,000 Coins' },
    { label: 'Available Balance', value: '12,500 🪙', icon: CreditCard, trend: '≈ 12,500 Coins' },
  ];

  const recentActivity = [
    { id: 1, action: 'Campaign Started', project: 'Fitness Tracker Pro', time: '2 hours ago', status: 'Active' },
    { id: 2, action: 'Payment Processed', project: 'Account Funding', time: '5 hours ago', status: 'Completed' },
    { id: 3, action: 'Test Completed', project: 'Language Learner', time: '1 day ago', status: 'Under Review' },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow border">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow border flex flex-col items-center justify-center text-center h-64">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any projects. Get started by creating your first project.</p>
          <a href="/customer/projects" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Project</a>
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
