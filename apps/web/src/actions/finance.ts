'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Reward, Wallet, WalletLedgerEntry, RewardType, RewardConfig } from '@12-test-gig/types';
import { FieldValue } from 'firebase-admin/firestore';
import { createNotification } from './notifications';

/**
 * Ensures a tester has a wallet. Creates one if missing.
 */
export async function ensureWalletExists(userId: string, testerId: string, currency: string = 'USD'): Promise<string> {
  const walletsRef = adminDb.collection('wallets');
  const snapshot = await walletsRef.where('userId', '==', userId).where('currency', '==', currency).get();

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const newWalletRef = walletsRef.doc();
  const newWallet: Wallet = {
    id: newWalletRef.id,
    userId,
    testerId,
    currency,
    availableBalanceMinor: 0,
    pendingBalanceMinor: 0,
    lifetimeEarnedMinor: 0,
    lifetimeWithdrawnMinor: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await newWalletRef.set(newWallet);
  return newWalletRef.id;
}

/**
 * Idempotently generates a reward and decrements the campaign's remaining budget.
 */
export async function processReward(
  idempotencyKey: string,
  campaignId: string,
  organizationId: string,
  testerId: string,
  userId: string,
  assignmentId: string,
  rewardType: RewardType,
  amountMinor: number,
  currency: string = 'USD'
) {
  const rewardRef = adminDb.collection('rewards').doc(idempotencyKey);
  const campaignRef = adminDb.collection('campaigns').doc(campaignId);
  const walletId = await ensureWalletExists(userId, testerId, currency);
  const walletRef = adminDb.collection('wallets').doc(walletId);

  const newReward = await adminDb.runTransaction(async (transaction) => {
    // 1. Idempotency Check
    const existingReward = await transaction.get(rewardRef);
    if (existingReward.exists) {
      throw new Error('Reward already processed.');
    }

    // 2. Budget Check
    const campaignDoc = await transaction.get(campaignRef);
    if (!campaignDoc.exists) throw new Error('Campaign not found.');
    
    // In a real scenario, campaign config/budget is stored on the campaign doc or a subcollection
    const totalBudget = campaignDoc.data()?.totalBudget || 0;
    const reservedBudget = campaignDoc.data()?.reservedBudgetMinor || totalBudget; 
    const earnedBudget = campaignDoc.data()?.earnedBudgetMinor || 0;
    const remainingBudget = reservedBudget - earnedBudget;

    if (amountMinor > remainingBudget) {
      throw new Error('Campaign budget exceeded.');
    }

    // 3. Create Pending Reward
    const reward: Reward = {
      id: idempotencyKey,
      organizationId,
      campaignId,
      projectId: campaignDoc.data()?.projectId,
      appId: campaignDoc.data()?.appId,
      testerId,
      assignmentId,
      type: rewardType,
      amountMinor,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    transaction.set(rewardRef, reward);

    // 4. Update Campaign Budget
    transaction.update(campaignRef, {
      earnedBudgetMinor: FieldValue.increment(amountMinor),
      pendingBudgetMinor: FieldValue.increment(amountMinor)
    });

    // 5. Update Wallet Pending Balance
    transaction.update(walletRef, {
      pendingBalanceMinor: FieldValue.increment(amountMinor),
      updatedAt: new Date().toISOString()
    });

    return reward;
  });
  
  // Outside of transaction, send notification
  await createNotification(userId, 'Reward Pending', `A reward of ${amountMinor} has been generated and is pending approval.`, 'reward_pending', newReward.id);

  return newReward;
}

/**
 * Approves and settles a pending reward, moving it to Available Balance and writing to the Ledger.
 */
export async function settleReward(rewardId: string, adminId: string) {
  const rewardRef = adminDb.collection('rewards').doc(rewardId);

  const result = await adminDb.runTransaction(async (transaction) => {
    const rewardDoc = await transaction.get(rewardRef);
    if (!rewardDoc.exists) throw new Error('Reward not found');
    
    const reward = rewardDoc.data() as Reward;
    if (reward.status !== 'pending') throw new Error('Reward is not pending');

    const walletsRef = adminDb.collection('wallets');
    const walletSnapshot = await transaction.get(walletsRef.where('testerId', '==', reward.testerId).where('currency', '==', reward.currency));
    if (walletSnapshot.empty) throw new Error('Wallet not found');

    const walletDoc = walletSnapshot.docs[0];
    const walletRef = walletDoc.ref;
    const currentAvailable = walletDoc.data().availableBalanceMinor;
    const newAvailable = currentAvailable + reward.amountMinor;

    // 1. Update Reward
    transaction.update(rewardRef, {
      status: 'paid',
      approvedAt: new Date().toISOString(),
      approvedBy: adminId
    });

    // 2. Update Wallet (Move Pending to Available)
    transaction.update(walletRef, {
      pendingBalanceMinor: FieldValue.increment(-reward.amountMinor),
      availableBalanceMinor: FieldValue.increment(reward.amountMinor),
      lifetimeEarnedMinor: FieldValue.increment(reward.amountMinor),
      updatedAt: new Date().toISOString()
    });

    // 3. Create Immutable Ledger Entry
    const ledgerRef = adminDb.collection('wallet_ledger').doc();
    const ledgerEntry: WalletLedgerEntry = {
      id: ledgerRef.id,
      userId: walletDoc.data().userId,
      testerId: reward.testerId,
      type: 'reward_settlement',
      referenceType: 'reward',
      referenceId: reward.id,
      direction: 'credit',
      amountMinor: reward.amountMinor,
      currency: reward.currency,
      balanceBeforeMinor: currentAvailable,
      balanceAfterMinor: newAvailable,
      description: `Settled reward for ${reward.type}`,
      createdAt: new Date().toISOString()
    };

    transaction.set(ledgerRef, ledgerEntry);

    // 4. Update Campaign (Move Pending to Earned-Settled) - Omitted for brevity, but requires campaignRef

    return { reward, walletUserId: walletDoc.data().userId };
  });

  await createNotification(result.walletUserId, 'Reward Settled', `Your reward of ${result.reward.amountMinor} has been settled to your available balance.`, 'reward_settled', rewardId);

  return true;
}

/**
 * Handles withdrawal requests, verifying balance and reserving funds.
 */
export async function requestWithdrawal(userId: string, testerId: string, amountMinor: number, currency: string = 'USD') {
  const walletsRef = adminDb.collection('wallets');
  
  return adminDb.runTransaction(async (transaction) => {
    const walletSnapshot = await transaction.get(walletsRef.where('userId', '==', userId).where('currency', '==', currency));
    if (walletSnapshot.empty) throw new Error('Wallet not found');

    const walletDoc = walletSnapshot.docs[0];
    const walletData = walletDoc.data() as Wallet;

    if (walletData.status !== 'active') throw new Error('Wallet is locked or suspended.');
    if (walletData.availableBalanceMinor < amountMinor) throw new Error('Insufficient funds.');

    // 1. Create Withdrawal Request
    const requestRef = adminDb.collection('withdrawal_requests').doc();
    transaction.set(requestRef, {
      id: requestRef.id,
      userId,
      testerId,
      amountMinor,
      currency,
      status: 'requested',
      requestedAt: new Date().toISOString()
    });

    // 2. Reserve Funds (Debit Available)
    transaction.update(walletDoc.ref, {
      availableBalanceMinor: FieldValue.increment(-amountMinor),
      updatedAt: new Date().toISOString()
    });

    // 3. Immutable Ledger Entry (Reservation)
    const ledgerRef = adminDb.collection('wallet_ledger').doc();
    transaction.set(ledgerRef, {
      id: ledgerRef.id,
      userId,
      testerId,
      type: 'withdrawal_reservation',
      referenceType: 'withdrawal_request',
      referenceId: requestRef.id,
      direction: 'debit',
      amountMinor,
      currency,
      balanceBeforeMinor: walletData.availableBalanceMinor,
      balanceAfterMinor: walletData.availableBalanceMinor - amountMinor,
      description: 'Reserved funds for withdrawal',
      createdAt: new Date().toISOString()
    });

    return requestRef.id;
  });
}
