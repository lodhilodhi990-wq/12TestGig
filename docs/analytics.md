# Read-Only Analytics System

The Phase 8 Analytics System is designed strictly to read data. It will **never** mutate ledgers, budgets, or rewards. 

## Aggregation Approach
To prevent out-of-memory crashes on massive datasets, analytics leverages native Firestore server-side aggregations:
- `count()`
- `sum()` (where appropriate indexes exist)
- `average()`

## Isolation
Customer organizations can only query metrics for their own `organizationId`. Server actions in `apps/web/src/actions/analytics.ts` enforce this by asserting ownership over the queried campaigns.
Testers have a private dashboard that strictly filters `assignedTo == request.auth.uid`.

## Real-time vs Caching
For overview dashboards, stats are aggregated in real-time. For very large datasets in the future, a chron job should be scheduled to write to an `analytics_snapshots` collection daily.
