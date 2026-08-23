# Play Store Readiness Checklist

The Play Store Readiness Checklist is a self-service interactive assistant for customers aiming to launch on Google Play.

## Advisory Status
> [!WARNING]  
> The Readiness Score is purely for internal tracking. Achieving 100% does **NOT** guarantee Google Play approval, and the platform UI reflects this clearly to avoid liability.

## Structure
- `PlayStoreChecklist` represents an App's overall status.
- `ChecklistItem` represents individual tasks (e.g., Privacy Policy, 20-Tester Track).
Customers can mark items as `not_started`, `in_progress`, or `completed`. The system calculates a percentage based on `required` items.
