import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function Disputes() {
  const disputes = [
    { id: 'DSP-001', project: 'Fitness Tracker Pro', customer: 'john@example.com', tester: 'alex@example.com', reason: 'Tester did not complete daily tasks', status: 'Open', date: 'Oct 22, 2023' },
    { id: 'DSP-002', project: 'Language Learner', customer: 'sarah@example.com', tester: 'mike@example.com', reason: 'App crashed on startup, tester gave 1 star', status: 'Resolved', date: 'Oct 20, 2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dispute Management</h1>
          <p className="text-saas-text-muted mt-1">Review and resolve conflicts between customers and testers.</p>
        </div>
      </div>

      <div className="bg-saas-card rounded-xl border border-saas-border overflow-hidden">
        <table className="w-full text-left text-sm text-saas-text">
          <thead className="bg-saas-dark border-b border-saas-border text-saas-text-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Dispute ID & Reason</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Tester</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saas-border">
            {disputes.map(dispute => (
              <tr key={dispute.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{dispute.id} - {dispute.project}</div>
                  <div className="text-saas-text-muted mt-1 max-w-xs truncate">{dispute.reason}</div>
                </td>
                <td className="px-6 py-4">{dispute.customer}</td>
                <td className="px-6 py-4">{dispute.tester}</td>
                <td className="px-6 py-4 text-saas-text-muted">{dispute.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${dispute.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {dispute.status === 'Open' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {dispute.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
