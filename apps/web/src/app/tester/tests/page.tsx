'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import TesterLayout from '@/components/TesterLayout';
import { Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function MyTests() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const activeTests = [
    { id: 1, name: 'Fitness Tracker Pro', daysLeft: 4, status: 'In Progress', reward: '$15', completedTasks: 9, totalTasks: 14 },
    { id: 2, name: 'Language Learner', daysLeft: 12, status: 'Just Started', reward: '$20', completedTasks: 2, totalTasks: 14 },
  ];

  const completedTests = [
    { id: 3, name: 'Meditation App', date: '2023-10-15', reward: '$12', status: 'Paid' },
  ];

  const handleStartTask = (id: number) => {
    setSelectedTask(id);
  };

  return (
    <ProtectedRoute allowedRoles={['tester']}>
      <TesterLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">My Tests</h1>
            <p className="text-zinc-500 mt-1">Manage your active assignments and daily testing tasks.</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-zinc-200">
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'active' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Active Tests
              {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'completed' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Completed Tests
              {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'active' ? (
            <div className="space-y-4">
              {activeTests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">{test.name}</h2>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-emerald-600 font-semibold">{test.reward} Reward</span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-zinc-500">{test.daysLeft} days remaining</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStartTask(test.id)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4" /> Start Daily Task
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-zinc-700">Progress</span>
                      <span className="text-zinc-500">{test.completedTasks} / {test.totalTasks} days completed</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(test.completedTasks / test.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">App Name</th>
                    <th className="px-6 py-4 font-medium">Completion Date</th>
                    <th className="px-6 py-4 font-medium">Reward</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {completedTests.map(test => (
                    <tr key={test.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4 font-medium text-zinc-900">{test.name}</td>
                      <td className="px-6 py-4 text-zinc-500">{test.date}</td>
                      <td className="px-6 py-4 text-emerald-600 font-medium">{test.reward}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Task Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="w-6 h-6 ml-1" />
              </div>
              <h3 className="text-xl font-bold text-center text-zinc-900 mb-2">Ready to Start?</h3>
              <p className="text-center text-zinc-500 mb-6">
                Please ensure you keep the app open for at least 3 minutes to register your daily activity. Our system will track it automatically.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Task started! Tracking initiated.');
                    setSelectedTask(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                >
                  Open App
                </button>
              </div>
            </div>
          </div>
        )}
      </TesterLayout>
    </ProtectedRoute>
  );
}
