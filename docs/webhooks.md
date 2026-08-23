# Webhook Processing System

## Secure Ingestion
Payment providers asynchronously report the status of payouts via webhooks. The platform exposes a generic endpoint `/api/webhooks/payment/[provider]` for this purpose.

## Security Gates
1. **Signature Verification**: Every incoming webhook payload is checked against a cryptographic signature (`x-provider-signature` or equivalent HMAC) using `PaymentProvider.verifyWebhook()`.
2. **Event Deduplication**: Webhooks are notoriously delivered "at least once". The system uses the `payment_webhook_events` collection to record the `eventId`. If an `eventId` is seen again, the request is returned 200 OK without double-processing the ledger.
3. **Atomic Finalization**: Once an event passes deduplication and is verified as a payout success/failure, a Firestore Transaction modifies the `withdrawal_requests` status and creates the final `wallet_ledger` entry.
