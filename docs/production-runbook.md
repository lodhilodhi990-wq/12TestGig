# 12 Test Gig - Production Runbook

This runbook outlines the operational procedures for managing the 12 Test Gig platform in a production environment.

## 1. Monitoring & Health
- The primary health dashboard is located at `/admin/operations`.
- The public health endpoint is `GET /api/health`.
- The internal detailed health endpoint is `GET /api/admin/health`.

### Missing Infrastructure (Action Required)
- **Error Tracking**: `NOT CONFIGURED`. (Integrate Sentry to capture Next.js server exceptions).
- **Database Backups**: `NOT CONFIGURED`. (Enable daily Firestore backups in the Google Cloud Console).
- **Uptime Monitoring**: `NOT CONFIGURED`. (Configure UptimeRobot or Datadog to ping `/api/health`).

## 2. Incident Management (SEV1 - SEV4)
Incidents are managed at `/admin/incidents`.
- **SEV1**: Critical platform outage (Database down, Payment provider down).
- **SEV2**: Major feature broken (Testing engine failing, Webhooks failing).
- **SEV3**: Minor feature broken (AI assistant failing, email delays).
- **SEV4**: Cosmetic issues or minor bugs.

## 3. Maintenance Mode
- Can be toggled via `/admin/operations` Feature Flags.
- When enabled, only users with `operations.view` permissions can bypass the maintenance screen.
- **Safety**: Maintenance mode DOES NOT disable API authentication. It simply intercepts UI routing.

## 4. Disaster Recovery (RTO: 4h / RPO: 24h)
- If the database is corrupted, restore from the last midnight Firestore backup.
- **Never attempt to manually edit the Ledger** to fix corruption. Restore the entire snapshot to preserve transaction atomicity.

## 5. Webhook Failure Recovery
- If Stripe webhooks fail to process, they will be logged as failed.
- Admins can manually click "Retry" in the `/admin/operations/payments` dashboard.
- The system uses idempotency keys to ensure that a retried webhook does not trigger a double-payout.
