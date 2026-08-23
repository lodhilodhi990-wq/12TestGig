'use server';

import { adminDb } from '@/lib/firebase-admin';
import { WithdrawalRequest, Wallet, WalletLedgerEntry, PaymentMethod } from '@12-test-gig/types';
import { FieldValue } from 'firebase-admin/firestore';
import { MockPaymentProvider, PayoutRequest } from '@/lib/payments/providers';
import { createNotification } from './notifications';

const provider = new MockPaymentProvider(); // Future: Load based on config

/**
 * Validates a withdrawal and reserves funds in the wallet.
 */
export async function approveWithdrawal(withdrawalId: string, adminId: string) {
  const withdrawalRef = adminDb.collection('withdrawal_requests').doc(withdrawalId);
  
  return adminDb.runTransaction(async (transaction) => {
    const withdrawalDoc = await transaction.get(withdrawalRef);
    if (!withdrawalDoc.exists) throw new Error('Withdrawal request not found.');

    const data = withdrawalDoc.data() as WithdrawalRequest;
    
    if (data.status !== 'requested' && data.status !== 'under_review') {
      throw new Error(`Cannot approve withdrawal in status: ${data.status}`);
    }

    // 1. Verify Payment Method
    const pmRef = adminDb.collection('payment_methods').doc(data.paymentMethodId!);
    const pmDoc = await transaction.get(pmRef);
    if (!pmDoc.exists) throw new Error('Payment method not found.');
    if (pmDoc.data()?.status !== 'active') throw new Error('Payment method is not active.');

    // 2. We already reserved funds when it was 'requested' in Phase 5.
    // If we haven't (e.g. if we move reservation here), we would reserve it now.
    // But per Phase 5 `requestWithdrawal`, funds are ALREADY reserved.
    
    // 3. Update Withdrawal to Processing
    transaction.update(withdrawalRef, {
      status: 'processing',
      approvedAt: new Date().toISOString(),
      reviewedBy: adminId,
      processingAt: new Date().toISOString(),
    });

    return { data, pmData: pmDoc.data() as PaymentMethod };
  }).then(async (result) => {
    
    // 4. Trigger Provider Payout OUTSIDE transaction (to avoid external API calls inside transaction)
    const request: PayoutRequest = {
      withdrawalId: result.data.id,
      testerId: result.data.testerId,
      amountMinor: result.data.amountMinor,
      currency: result.data.currency,
      paymentMethodId: result.pmData.id,
      providerAccountId: result.pmData.providerAccountId,
      idempotencyKey: result.data.id // Use withdrawal ID as idempotency key
    };

    try {
      const payoutResult = await provider.createPayout(request);
      
      // Update withdrawal with provider details
      await withdrawalRef.update({
        provider: provider.name,
        providerPayoutId: payoutResult.providerPayoutId,
        providerReference: payoutResult.providerReference,
        status: payoutResult.status === 'failed' ? 'failed' : 'processing',
        failureReason: payoutResult.failureReason
      });

      if (payoutResult.status === 'failed') {
        await handleFailedWithdrawal(result.data.id, payoutResult.failureReason || 'Provider rejected creation');
      }

    } catch (error: any) {
      // If provider completely throws, mark as failed
      await withdrawalRef.update({
        status: 'failed',
        failureReason: error.message
      });
      await handleFailedWithdrawal(result.data.id, error.message);
    }
  });
}

/**
 * Handles a failed withdrawal by releasing the reserved funds back to the user's available balance.
 */
export async function handleFailedWithdrawal(withdrawalId: string, reason: string) {
  const withdrawalRef = adminDb.collection('withdrawal_requests').doc(withdrawalId);
  
  await adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(withdrawalRef);
    if (!doc.exists) return;
    const data = doc.data() as WithdrawalRequest;

    if (data.status !== 'failed' && data.status !== 'rejected') return;

    const walletsRef = adminDb.collection('wallets');
    const walletSnapshot = await transaction.get(walletsRef.where('userId', '==', data.userId).where('currency', '==', data.currency));
    if (walletSnapshot.empty) return;

    const walletDoc = walletSnapshot.docs[0];
    const walletRef = walletDoc.ref;
    const walletData = walletDoc.data() as Wallet;

    // Release funds (Credit Available Balance)
    transaction.update(walletRef, {
      availableBalanceMinor: FieldValue.increment(data.amountMinor),
      updatedAt: new Date().toISOString()
    });

    // Ledger Entry for Release
    const ledgerRef = adminDb.collection('wallet_ledger').doc();
    const ledgerEntry: WalletLedgerEntry = {
      id: ledgerRef.id,
      userId: data.userId,
      testerId: data.testerId,
      type: 'withdrawal_release',
      referenceType: 'withdrawal_request',
      referenceId: data.id,
      direction: 'credit',
      amountMinor: data.amountMinor,
      currency: data.currency,
      balanceBeforeMinor: walletData.availableBalanceMinor,
      balanceAfterMinor: walletData.availableBalanceMinor + data.amountMinor,
      description: `Released funds for failed withdrawal: ${reason}`,
      createdAt: new Date().toISOString()
    };
    transaction.set(ledgerRef, ledgerEntry);
  });

  const doc = await withdrawalRef.get();
  await createNotification(doc.data()?.userId, 'Withdrawal Failed', `Your withdrawal failed: ${reason}. Funds have been returned to your balance.`, 'withdrawal_failed');
}

/**
 * Handles a successful withdrawal webhook event, finalizing the ledger.
 */
export async function finalizeSuccessfulWithdrawal(withdrawalId: string) {
  const withdrawalRef = adminDb.collection('withdrawal_requests').doc(withdrawalId);
  
  await adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(withdrawalRef);
    if (!doc.exists) throw new Error('Withdrawal not found');
    const data = doc.data() as WithdrawalRequest;

    if (data.status === 'completed') return; // Idempotent

    const walletsRef = adminDb.collection('wallets');
    const walletSnapshot = await transaction.get(walletsRef.where('userId', '==', data.userId).where('currency', '==', data.currency));
    if (walletSnapshot.empty) throw new Error('Wallet not found');

    const walletDoc = walletSnapshot.docs[0];
    const walletRef = walletDoc.ref;

    transaction.update(withdrawalRef, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    // Update Lifetime Withdrawn
    transaction.update(walletRef, {
      lifetimeWithdrawnMinor: FieldValue.increment(data.amountMinor),
      updatedAt: new Date().toISOString()
    });

    // Ledger Entry for Completion (Note: Available was already debited when reserved, we just record the completion)
    const ledgerRef = adminDb.collection('wallet_ledger').doc();
    const ledgerEntry: WalletLedgerEntry = {
      id: ledgerRef.id,
      userId: data.userId,
      testerId: data.testerId,
      type: 'withdrawal_completed',
      referenceType: 'withdrawal_request',
      referenceId: data.id,
      direction: 'debit',
      amountMinor: data.amountMinor,
      currency: data.currency,
      balanceBeforeMinor: walletDoc.data().availableBalanceMinor,
      balanceAfterMinor: walletDoc.data().availableBalanceMinor, // No change to available, it was reserved earlier
      description: 'Withdrawal successfully completed',
      createdAt: new Date().toISOString()
    };
    transaction.set(ledgerRef, ledgerEntry);
  });

  const doc = await withdrawalRef.get();
  await createNotification(doc.data()?.userId, 'Withdrawal Completed', 'Your withdrawal has been successfully processed.', 'withdrawal_completed');
}
