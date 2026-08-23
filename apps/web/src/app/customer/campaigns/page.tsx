'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';
import { Rocket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerCampaigns() {
  const campaigns = [
    { id: 1, appName: 'Fitness Tracker Pro', status: 'Running', testers: '20/20', daysLeft: 4, type: '14-Day Closed Test' },
    { id: 2, appName: 'Language Learner', status: 'Pending', testers: '0/20', daysLeft: 14, type: '14-Day Closed Test' },
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
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Testers</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900">{camp.appName}</td>
                  <td className="px-6 py-4 text-zinc-500">{camp.type}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{camp.testers}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" /> 
                      <span className="text-zinc-700">{camp.daysLeft} days left</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${camp.status === 'Running' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {camp.status === 'Running' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
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
