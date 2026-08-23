import React from 'react';

export default function AdminUsersPage() {
  const users = [
    { id: 'usr_1', email: 'tester@example.com', role: 'tester', status: 'active', risk: 'normal' },
    { id: 'usr_2', email: 'spam@example.com', role: 'tester', status: 'suspended', risk: 'high' },
    { id: 'usr_3', email: 'client@org.com', role: 'customer_owner', status: 'active', risk: 'normal' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="flex space-x-2 mb-4">
        <input type="text" placeholder="Search by email or ID..." className="border p-2 rounded w-64" />
        <select className="border p-2 rounded">
          <option>All Roles</option>
          <option>Testers</option>
          <option>Customers</option>
        </select>
        <select className="border p-2 rounded">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">User ID</th>
              <th className="p-4 font-medium text-gray-500">Email</th>
              <th className="p-4 font-medium text-gray-500">Role</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Risk</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4 font-mono text-sm">{u.id}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {u.risk === 'high' ? (
                    <span className="text-red-600 font-bold">HIGH</span>
                  ) : (
                    <span className="text-gray-500">Normal</span>
                  )}
                </td>
                <td className="p-4 space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                  {u.status === 'active' && (
                    <button className="text-red-600 hover:underline text-sm">Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
