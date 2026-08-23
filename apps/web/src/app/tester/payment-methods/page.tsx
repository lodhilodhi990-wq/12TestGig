import React from 'react';

export default function TesterPaymentMethodsPage() {
  const methods = [
    { id: 'pm_1', type: 'Bank Account', provider: 'Stripe', maskedDetails: '**** 1234', status: 'active', currency: 'USD' },
    { id: 'pm_2', type: 'PayPal', provider: 'PayPal', maskedDetails: 'john****@email.com', status: 'pending_verification', currency: 'USD' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Add Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {methods.map(method => (
          <div key={method.id} className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg">{method.type}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${method.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {method.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-gray-500">{method.provider} • {method.maskedDetails} • {method.currency}</p>
            </div>
            <div className="space-x-2">
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">Disable</button>
            </div>
          </div>
        ))}
        {methods.length === 0 && (
          <p className="text-gray-500">No payment methods added yet.</p>
        )}
      </div>
    </div>
  );
}
