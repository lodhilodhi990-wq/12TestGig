# Financial Security

## Client-Side Restrictions
The Firebase Client SDK is **strictly prohibited** from performing writes, updates, or deletes against the following collections:
- `wallets`
- `wallet_ledger`
- `rewards`
- `withdrawal_requests`

All financial mutations are gated behind secure Next.js Server Actions (e.g., `apps/web/src/actions/finance.ts`).

## Zero Trust Architecture
The backend never trusts frontend payloads asserting balance limits or reward amounts.
1. When generating a reward, the backend verifies the campaign configuration.
2. When a withdrawal is requested, the backend performs a fresh read of the wallet's `availableBalanceMinor` to confirm sufficient funds.

## Admin Role Verification
Manual adjustments or wallet locks enforce strict Role-Based Access Control (RBAC). Only users holding the `admin` or `super_admin` role with the `finance_manage` permission flag can perform these operations.
