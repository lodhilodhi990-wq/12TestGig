# Reward Ledger Architecture

## Concept
The `wallet_ledger` collection is an immutable, append-only ledger that acts as the single source of truth for all balance-affecting actions on the platform.

## Immutability Rule
**No ledger entry may ever be deleted or mutated.**
If an erroneous reward is granted and settled, it must be rectified using a new **compensating ledger entry** (Debit) rather than deleting the original credit.

## Ledger Entries
Every ledger entry dictates:
- `direction`: `credit` or `debit`
- `amountMinor`: The absolute value of the change.
- `balanceBeforeMinor` & `balanceAfterMinor`: Providing cryptographic-style linkage for historical auditing.
- `referenceType` & `referenceId`: The exact business entity that triggered this change (e.g., `reward: 12345`).

The Wallet's `availableBalanceMinor` should theoretically always match the sum of all historic ledger entries. An Admin Reconciliation tool checks for discrepancies.
