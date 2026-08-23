'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { Smartphone, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CustomerProjects() {
  const projects = [
    { id: 1, name: 'Fitness Tracker Pro', package: 'com.fitnesstracker.pro', status: 'Active', testers: 20 },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">My Projects (Apps)</h1>
            <p className="text-zinc-500 mt-1">Manage your Android applications and campaigns.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New App
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <div key={proj.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">{proj.name}</h3>
                <p className="text-sm text-zinc-500 font-mono mt-1">{proj.package}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                    {proj.status}
                  </span>
                  <span className="text-xs text-zinc-500">{proj.testers} Testers active</span>
                </div>
              </div>
              <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
                <Link href={`/customer/campaigns?project=${proj.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                  View Campaigns
                </Link>
                <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors min-h-[240px]">
            <div className="w-12 h-12 bg-white border border-zinc-200 text-zinc-400 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900">Register New App</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">Add a new Android app to start testing campaigns.</p>
          </div>
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
