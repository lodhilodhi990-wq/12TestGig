'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import EarnerLayout from '@/components/EarnerLayout';
import { UserPlus, Star, Mail } from 'lucide-react';

export default function EarnerNetwork() {
  const network = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', joined: 'Oct 12, 2023', score: '4.9/5', status: 'Active Tester' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', joined: 'Oct 15, 2023', score: '4.5/5', status: 'Active Tester' },
  ];

  return (
    <ProtectedRoute allowedRoles={['earner']}>
      <EarnerLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">My Network</h1>
              <p className="text-zinc-500 mt-1">Manage the testers you have recruited.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Invite Tester
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Recruit</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium">Quality Score</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {network.map(person => (
                  <tr key={person.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">{person.name}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3"/> {person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{person.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-4 h-4 fill-amber-500" /> {person.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {person.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </EarnerLayout>
    </ProtectedRoute>
  );
}
