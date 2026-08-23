export default function Organizations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
      <p className="text-saas-muted">Manage all SaaS tenants and B2B customers here.</p>
      
      <div className="bg-saas-card border border-slate-800 rounded-xl p-8 flex items-center justify-center text-center">
        <div>
          <h3 className="text-xl font-bold mb-2">No Organizations Found</h3>
          <p className="text-saas-muted">Wait for Firebase database sync to complete.</p>
        </div>
      </div>
    </div>
  );
}
