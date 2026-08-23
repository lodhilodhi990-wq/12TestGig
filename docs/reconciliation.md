# Reconciliation

## Purpose
Because the Wallet acts as a high-performance read-cache of the `wallet_ledger`, it is mathematically possible (though structurally prevented by transactions) for a discrepancy to occur due to unexpected platform faults.

## Reconciliation Process
The Reconciliation Tool (available in the Admin Finance Dashboard) performs a historic scan of a tester's `wallet_ledger`.
It computes:
`Calculated Available Balance = Sum(Credits) - Sum(Debits) - Sum(Reserved Withdrawals)`

It then asserts:
`Calculated Available Balance === wallets.availableBalanceMinor`

## Resolving Mismatches
If the tool detects a mismatch, the wallet transitions to an `under_review` state.
Admins **must not silently edit the wallet balance**. Instead, they must issue a Manual Adjustment (creating a new Ledger Entry) that offsets the discrepancy and produces an immutable audit trail.
