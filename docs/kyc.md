# KYC (Know Your Customer) Foundation

## Strategy
To comply with anti-money laundering (AML) and financial regulations, testers must complete KYC verification before their `PaymentMethod` can transition to `active`.

## Implementation
We use the `identity_verifications` collection to track the status of a tester's KYC securely. 
- Raw Identity Documents (Passports, IDs) are **not** stored directly in Firestore due to severe privacy risks.
- Instead, the tester uploads docs directly to the payment provider (e.g., Stripe Identity) via a secure hosted flow. 
- The backend stores a `verificationReference` and listens for provider webhooks to update the `KycStatus` to `verified`.

## Cooling Period
As a security measure, changing an active payout method may enforce an automatic cooling period (configurable by admins) to prevent account takeover (ATO) actors from immediately withdrawing stolen funds.
