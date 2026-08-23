# Production Deployment & Hardening Guide

## Environment Variables
Before deploying, duplicate `.env.example` to your production environment management system (e.g. Vercel Env Vars, GitHub Secrets) and populate real values.
- **CRITICAL**: Never commit `.env` or `.env.local` to Git.

## Webhooks & Payments
In production, `PAYMENT_PROVIDER` must be set to `stripe`.
Configure your Stripe webhook to point to `https://app.12testgig.com/api/webhooks/payment/stripe` and use the resulting webhook secret for `STRIPE_WEBHOOK_SECRET`.

## Backup Strategy
- **Firestore**: NOT CONFIGURED. You must enable Automated Scheduled Backups in the Google Cloud Console (Firestore -> Backups). Set retention to at least 7 days.
- **Storage**: NOT CONFIGURED. Enable Object Versioning on your production Firebase Storage bucket to prevent accidental deletion of Play Store Readiness artifacts (AABs).

## Monitoring & Disaster Recovery
- **Error Tracking**: NOT CONFIGURED. (Recommend integrating Sentry or Datadog).
- **RTO (Recovery Time Objective)**: 4 hours (Estimated, dependent on GCP backup restoration).
- **RPO (Recovery Point Objective)**: 1 day (Based on daily automated backups).

## Rollback Plan
If a severe production issue occurs:
1. Revert to the previous stable Git commit and trigger a Vercel production rebuild.
2. If data corruption occurred due to a bad release, DO NOT attempt manual JSON rollbacks. Use Google Cloud Console to restore Firestore from the last midnight backup.
