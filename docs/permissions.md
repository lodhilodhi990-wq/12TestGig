# Role-Based Access Control (RBAC)

## Roles
The platform defines multiple admin-level roles to enforce the Principle of Least Privilege:
- `super_admin`: Has all permissions.
- `admin`: General management, lacking deep financial/system overrides.
- `moderator`: Can view testers, campaigns, and moderate bugs/feedback. Cannot view finance.
- `finance_admin`: Can manage rewards, wallets, withdrawals, and financial disputes.
- `finance_viewer`: Read-only access to financial ledgers for reconciliation.
- `support_admin`: General support access, dispute management.

## Middleware Enforcer
The `requirePermission(adminId, permission)` function in `apps/web/src/actions/permissions.ts` strictly enforces these roles.
If a frontend UI accidentally shows an "Approve Withdrawal" button to a `moderator`, the Server Action will intercept the request and throw a `Forbidden` error, preventing the transaction.
