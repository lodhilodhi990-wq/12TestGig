export interface PayoutRequest {
  withdrawalId: string;
  testerId: string;
  amountMinor: number;
  currency: string;
  paymentMethodId: string;
  providerAccountId?: string;
  idempotencyKey: string;
}

export interface PayoutResult {
  status: 'processing' | 'completed' | 'failed';
  providerPayoutId?: string;
  providerReference?: string;
  failureReason?: string;
}

export interface WebhookEventValidation {
  valid: boolean;
  withdrawalId?: string;
  eventId?: string;
  eventType?: string;
  status?: 'completed' | 'failed' | 'reversed';
  failureReason?: string;
}

export interface PaymentProvider {
  name: string;
  createPayout(request: PayoutRequest): Promise<PayoutResult>;
  verifyWebhook(payload: string, signature: string): Promise<WebhookEventValidation>;
}

export class MockPaymentProvider implements PaymentProvider {
  name = 'mock_provider';

  async createPayout(request: PayoutRequest): Promise<PayoutResult> {
    console.log(`[MockProvider] Creating payout for ${request.withdrawalId}`);
    
    // Simulate successful creation of processing state
    return {
      status: 'processing',
      providerPayoutId: `mock_po_${Date.now()}`,
      providerReference: `mock_ref_${Math.floor(Math.random() * 10000)}`
    };
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEventValidation> {
    // In mock, assume payload is a JSON string of { eventId, type, withdrawalId }
    try {
      const data = JSON.parse(payload);
      if (signature !== 'valid_mock_signature') {
        return { valid: false };
      }

      return {
        valid: true,
        eventId: data.eventId,
        eventType: data.type,
        withdrawalId: data.withdrawalId,
        status: data.type === 'payout.paid' ? 'completed' : 'failed',
        failureReason: data.type === 'payout.failed' ? 'Simulated failure' : undefined
      };
    } catch (e) {
      return { valid: false };
    }
  }
}
