# Security Model

## Firestore Security Rules
- Uses strict role-based access control (RBAC).
- `isAdmin()` function ensures admins can access necessary data.
- Tenant isolation using `organizationId`.
- Immutable audit logs (client write access denied).
- Immutable financial data (`wallets`, `withdrawals`).

## Storage Rules
- Strict size limits and content-type validation.
- Folder isolation per user/session.
