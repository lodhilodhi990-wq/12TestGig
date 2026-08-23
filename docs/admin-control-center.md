# Admin Control Center Architecture

## Overview
The Admin Control Center is the centralized hub for managing Users, Testers, Customers, Campaigns, Finances, and Platform Safety. 

## Strict Isolation
Organization data is strictly isolated. An Admin with `organizations.manage` permission cannot view internal tester financial wallets unless they also possess the `wallets.view` permission.

## Auditing Every Action
Every destructive or modifying action performed by an Admin (e.g., Suspending a user, Approving a withdrawal, Cancelling a campaign) MUST be recorded in the `audit_logs` collection.
The log includes:
- `actor`: Admin ID
- `action`: e.g. `suspend_user`
- `target`: The user or resource affected
- `reason`: Explanation provided by the admin.

## User Restrictions vs Suspensions
- **Suspension**: A blanket block on the account. The user cannot log in or perform any actions.
- **Restriction**: Granular (`testing_disabled`, `withdrawal_disabled`). A user might be able to log in and withdraw existing funds but cannot take new testing jobs.
