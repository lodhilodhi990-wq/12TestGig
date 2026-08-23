'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerLayout from '@/components/CustomerLayout';

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="text-gray-500 text-sm font-medium">My Projects</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="text-gray-500 text-sm font-medium">My Apps</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="text-gray-500 text-sm font-medium">Active Campaigns</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
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
