import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DisputeItem {
  id: string;
  project: string;
  customer: string;
  tester: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Under Review';
  date: string;
}

export default function Disputes() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'disputes'), (snap) => {
        const list: DisputeItem[] = snap.docs.map(d => {
          const data = d.data();
          let formattedDate = 'Recent';
          if (data.createdAt?.toDate) {
            formattedDate = data.createdAt.toDate().toLocaleDateString();
          } else if (data.createdAt) {
            formattedDate = new Date(data.createdAt).toLocaleDateString();
          }

          return {
            id: d.id,
            project: data.appName || data.projectName || data.project || 'Testing Project',
            customer: data.customerEmail || data.customer || 'customer@example.com',
            tester: data.testerEmail || data.tester || 'tester@example.com',
            reason: data.reason || data.description || 'Disputed task completion',
            status: data.status || 'Open',
            date: formattedDate
          };
        });
        setDisputes(list);
        setLoading(false);
      }, (err) => {
        console.warn('Disputes listener notice:', err);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await updateDoc(doc(db, 'disputes', id), {
        status: 'Resolved',
        resolvedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('Failed to resolve dispute:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this dispute record?')) return;
    try {
      await deleteDoc(doc(db, 'disputes', id));
    } catch (e) {
      console.error('Failed to delete dispute:', e);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Anti-Scam & Dispute Resolution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time live dispute tickets and customer-tester task investigations from Firestore.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          {disputes.filter(d => d.status === 'Open').length} Open Disputes
        </span>
      </div>

      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to real disputes collection...</span>
          </div>
        ) : disputes.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-600" />
            <p className="font-bold text-white text-sm">No Active Disputes Found</p>
            <p className="text-slate-500 text-[11px] max-w-sm">
              When a developer or tester files an anti-fraud report or task dispute, it will appear here instantly for admin review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Dispute ID & Project</th>
                  <th className="p-4">Customer Email</th>
                  <th className="p-4">Tester Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {disputes.map(dispute => (
                  <tr key={dispute.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{dispute.id} - {dispute.project}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 max-w-xs truncate">{dispute.reason}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{dispute.customer}</td>
                    <td className="p-4 text-slate-300 font-mono">{dispute.tester}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{dispute.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        dispute.status === 'Open' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {dispute.status === 'Open' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {dispute.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dispute.status === 'Open' && (
                          <button
                            onClick={() => handleResolve(dispute.id)}
                            className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 transition text-[11px] cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(dispute.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                          title="Delete Dispute Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
