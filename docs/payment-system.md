# Payment System Architecture

## Overview
The 12 Test Gig Payment System handles the lifecycle of converting internal `availableBalanceMinor` into real-world fiat transfers via an abstracted Payment Provider interface.

## Core Abstraction
To avoid vendor lock-in and to safely test functionality, the backend interacts exclusively with the `PaymentProvider` interface. 
- **Current Provider**: `MockPaymentProvider` (used for Sandbox/Tests).
- **Future Providers**: Implementations like `StripeConnectProvider` will implement this interface.

## Idempotency
Every payout request sent to a provider is accompanied by an `idempotencyKey` strictly bound to the internal `withdrawalId`. This ensures that even if a network timeout occurs, the provider will not double-charge or create two payouts.

## Status Mapping
Internal withdrawal statuses:
- `requested`: Awaiting Admin review.
- `processing`: Approved and sent to the provider. Awaiting Webhook confirmation.
- `completed`: Confirmed by Provider.
- `failed`: Provider rejected the payout. Funds released.
