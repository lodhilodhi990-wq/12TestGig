# Wallet Architecture

## Concept
The Tester Wallet (`wallets` collection) acts as a high-performance cached view of a user's financial standing. A Wallet is strictly created by the server the first time a user generates an earning.

## Wallet Balances
- **Pending Balance (`pendingBalanceMinor`)**: Funds generated from rewards that have not yet been approved or settled.
- **Available Balance (`availableBalanceMinor`)**: Fully settled, approved funds that are legally available for withdrawal.
- **Lifetime Earned (`lifetimeEarnedMinor`)**: Running total of all historically settled credits.
- **Lifetime Withdrawn (`lifetimeWithdrawnMinor`)**: Running total of all historically completed withdrawals.

## Wallet Lock
Admins can transition a wallet status between `active`, `locked`, and `suspended`.
A `locked` wallet immediately prevents withdrawal requests, but rewards can still accrue according to business rules.
