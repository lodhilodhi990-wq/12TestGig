# Risk Management & Disputes

## Risk Events
The platform utilizes `risk_events` to flag suspicious behavior.
Examples of flags:
- `rapid_submissions`: A tester submitting evidence too fast.
- `duplicate_activity`: A tester trying to reuse screenshots.
- `payment_failure_pattern`: Repeated webhook payout failures for the same user.

These flags **do not automatically ban** a user. They generate a `RiskEvent` (with severity `low`, `medium`, `high`, `critical`) which appears in the `/admin/risk` dashboard for manual review.

## Dispute Workflow
Users or Admins can open Disputes via the `disputes` collection.
A dispute has a standard lifecycle:
`open` -> `under_review` -> `waiting_for_information` -> `resolved` (or `rejected`).

Financial disputes (e.g. missing rewards) **never** result in direct edits to previous ledger records. Instead, the resolving admin creates a new compensating transaction (e.g., Manual Adjustment Reward) to credit the user.
