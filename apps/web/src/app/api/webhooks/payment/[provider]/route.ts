import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { MockPaymentProvider } from '@/lib/payments/providers';
import { finalizeSuccessfulWithdrawal, handleFailedWithdrawal } from '@/actions/payout';

const provider = new MockPaymentProvider(); // In future, select provider by [provider] param

export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider: providerParam } = await params;
    const rawBody = await req.text();
    // Simulate reading signature from headers
    const signature = req.headers.get('x-provider-signature') || 'valid_mock_signature';

    const verification = await provider.verifyWebhook(rawBody, signature);

    if (!verification.valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (!verification.eventId || !verification.withdrawalId) {
      return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
    }

    // 1. Idempotency Check
    const eventIdStr = `${providerParam}_${verification.eventId}`;
    const eventRef = adminDb.collection('payment_webhook_events').doc(eventIdStr);
    
    const processed = await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(eventRef);
      if (doc.exists && doc.data()?.processed) {
        return true; // Already processed
      }

      transaction.set(eventRef, {
        id: eventIdStr,
        provider: providerParam,
        eventId: verification.eventId,
        eventType: verification.eventType,
        signatureVerified: true,
        processed: true,
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      return false;
    });

    if (processed) {
      return NextResponse.json({ status: 'Already processed' });
    }

    // 2. Process Payout Status
    if (verification.status === 'completed') {
      await finalizeSuccessfulWithdrawal(verification.withdrawalId);
    } else if (verification.status === 'failed') {
      await handleFailedWithdrawal(verification.withdrawalId, verification.failureReason || 'Webhook reported failure');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
