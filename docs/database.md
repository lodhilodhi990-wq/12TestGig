# Database Schema (Firestore)

## Core Collections
- `users`: Core profile data for all users.
- `organizations`: Tenant isolation for customers.
- `customers`: Customer-specific profile fields.
- `testers`: Tester-specific skills and rating fields.
- `earners`: Earner-specific profile fields.
- `audit_logs`: Immutable logs tracking critical system actions.

More collections will be documented as the data modeling expands in later phases.
