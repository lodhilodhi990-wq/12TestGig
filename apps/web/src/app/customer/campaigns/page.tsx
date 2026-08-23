'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { Rocket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerCampaigns() {
  const campaigns = [
    { id: 1, name: 'Fitness Tracker Pro', status: 'Active', testers: '12/20', spent: '1,200 🪙', budget: '2,000 🪙', nextAction: 'Review feedback' },
    { id: 2, name: 'Language Learner', status: 'Completed', testers: '15/15', spent: '1,500 🪙', budget: '1,500 🪙', nextAction: 'Export report' },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Campaigns</h1>
            <p className="text-zinc-500 mt-1">Monitor the testing progress of your applications.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Rocket className="w-5 h-5" /> Launch Campaign
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">App / Campaign</th>
                <th className="px-6 py-4 font-medium">Spent</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Testers</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900">{camp.name}</td>
                  <td className="px-6 py-4 font-medium text-emerald-600">{camp.spent}</td>
                  <td className="px-6 py-4 text-zinc-500">{camp.budget}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{camp.testers}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${camp.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {camp.status === 'Active' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
