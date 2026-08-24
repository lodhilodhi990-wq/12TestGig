'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { createNotification } from './notifications';
import { REFERRAL_TIERS, ReferralTier } from '@/lib/referralService';

export interface ReferralRelationship {
  id: string;
  referrerId: string;
  referrerCode: string;
  recruitUserId: string;
  recruitName: string;
  recruitEmail: string;
  campaign: string;
  channel: string;
  status: 'active' | 'fraud_flagged' | 'completed';
  totalCommissionEarnedCoins: number;
  completedTasksCount: number;
  joinedAt: string;
  updatedAt: string;
}

export interface CommissionPayoutLog {
  id: string;
  referrerId: string;
  recruitUserId: string;
  recruitName: string;
  sourceTask: string;
  taskRewardCoins: number;
  commissionRatePercent: number;
  commissionEarnedCoins: number;
  createdAt: string;
}

/**
 * Validates and atomically registers a new referral relationship in Firestore
 */
export async function registerReferralRelationship(
  recruitUserId: string,
  refCode: string,
  campaign: string = 'direct',
  channel: string = 'organic'
) {
  if (!recruitUserId || !refCode) return { success: false, error: 'Missing parameters' };

  try {
    // 1. Find Referrer by referralCode or ID
    const usersRef = adminDb.collection('users');
    let referrerDoc = null;

    // Search by referralCode
    const qSnap = await usersRef.where('referralCode', '==', refCode.trim().toUpperCase()).limit(1).get();
    if (!qSnap.empty) {
      referrerDoc = qSnap.docs[0];
    } else {
      // Fallback search by document ID or email prefix
      const directDoc = await usersRef.doc(refCode).get();
      if (directDoc.exists) {
        referrerDoc = directDoc;
      }
    }

    if (!referrerDoc || !referrerDoc.exists) {
      return { success: false, error: 'Referrer not found' };
    }

    const referrerId = referrerDoc.id;

    // 2. Anti-fraud check: Prevent self-referral
    if (referrerId === recruitUserId) {
      return { success: false, error: 'Self-referral is strictly not allowed' };
    }

    // 3. Check if relationship already exists
    const relRef = adminDb.collection('referral_relationships').doc(`${referrerId}_${recruitUserId}`);
    const existing = await relRef.get();
    if (existing.exists) {
      return { success: true, message: 'Referral already recorded' };
    }

    // Get recruit user doc for details
    const recruitDoc = await usersRef.doc(recruitUserId).get();
    const recruitData = recruitDoc.data() || {};
    const recruitName = recruitData.fullName || recruitData.name || 'New Tester';
    const recruitEmail = recruitData.email || '';

    // 4. Create Immutable Relationship Doc
    const newRelationship: ReferralRelationship = {
      id: relRef.id,
      referrerId,
      referrerCode: refCode.trim().toUpperCase(),
      recruitUserId,
      recruitName,
      recruitEmail,
      campaign: campaign || 'direct',
      channel: channel || 'organic',
      status: 'active',
      totalCommissionEarnedCoins: 0,
      completedTasksCount: 0,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await relRef.set(newRelationship);

    // 5. Update Referrer stats & recruit count
    await usersRef.doc(referrerId).update({
      totalRecruitsCount: FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });

    // 6. Give Welcome Bonus to Recruit (50 Coins)
    await usersRef.doc(recruitUserId).update({
      coins: FieldValue.increment(50),
      referredBy: refCode.trim().toUpperCase(),
      referralCampaign: campaign,
      referralChannel: channel,
    });

    // 7. Send Notifications
    await createNotification(
      referrerId,
      '🎉 New Recruit Joined Your Network!',
      `${recruitName} registered with your link (${campaign || 'direct'}). You will earn 10-20% lifetime commission on all their tests.`,
      'referral_joined',
      recruitUserId
    );

    await createNotification(
      recruitUserId,
      '🎁 50 Coins Welcome Bonus Activated!',
      `You received a 50 Coins welcome gift for joining through partner ${refCode}.`,
      'welcome_bonus'
    );

    return { success: true, relationship: newRelationship };
  } catch (error: any) {
    console.error('Error in registerReferralRelationship:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Distributes automated lifetime commission to the partner when a recruit completes a testing task
 */
export async function distributeReferralCommission(
  recruitUserId: string,
  sourceTask: string,
  taskRewardCoins: number = 200
) {
  if (!recruitUserId || taskRewardCoins <= 0) return { success: false };

  try {
    // 1. Find who referred this user
    const relationshipsRef = adminDb.collection('referral_relationships');
    const relSnap = await relationshipsRef.where('recruitUserId', '==', recruitUserId).limit(1).get();

    if (relSnap.empty) {
      // No referrer
      return { success: false, reason: 'No referrer found for this user' };
    }

    const relDoc = relSnap.docs[0];
    const relData = relDoc.data() as ReferralRelationship;

    if (relData.status !== 'active') {
      return { success: false, reason: 'Referral relationship not active' };
    }

    const referrerId = relData.referrerId;
    const usersRef = adminDb.collection('users');
    const referrerDoc = await usersRef.doc(referrerId).get();

    if (!referrerDoc.exists) {
      return { success: false, reason: 'Referrer profile not found' };
    }

    const referrerData = referrerDoc.data() || {};
    const activeRecruitsCount = referrerData.totalRecruitsCount || 1;

    // 2. Determine Tier & Commission Rate
    let commissionRate = 10; // Default Bronze 10%
    if (activeRecruitsCount >= 50) commissionRate = 20; // Diamond 20%
    else if (activeRecruitsCount >= 20) commissionRate = 15; // Gold 15%
    else if (activeRecruitsCount >= 5) commissionRate = 12; // Silver 12%

    const commissionCoins = Math.max(1, Math.round(taskRewardCoins * (commissionRate / 100)));

    // 3. Atomically Credit Referrer's Wallet
    await usersRef.doc(referrerId).update({
      coins: FieldValue.increment(commissionCoins),
      lifetimeCommissionCoins: FieldValue.increment(commissionCoins),
      updatedAt: new Date().toISOString(),
    });

    // 4. Update relationship record
    await relDoc.ref.update({
      totalCommissionEarnedCoins: FieldValue.increment(commissionCoins),
      completedTasksCount: FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });

    // 5. Create Commission Log
    const logRef = adminDb.collection('commission_payout_logs').doc();
    const log: CommissionPayoutLog = {
      id: logRef.id,
      referrerId,
      recruitUserId,
      recruitName: relData.recruitName || 'Recruit',
      sourceTask,
      taskRewardCoins,
      commissionRatePercent: commissionRate,
      commissionEarnedCoins: commissionCoins,
      createdAt: new Date().toISOString(),
    };
    await logRef.set(log);

    // 6. Notify the Referrer
    await createNotification(
      referrerId,
      `💰 Commission Credited: +${commissionCoins} Coins!`,
      `Your recruit ${relData.recruitName} completed "${sourceTask}". You received ${commissionRate}% commission (${commissionCoins} Coins).`,
      'commission_credited',
      logRef.id
    );

    return {
      success: true,
      commissionCoins,
      commissionRate,
      referrerId,
    };
  } catch (error: any) {
    console.error('Error in distributeReferralCommission:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Tracks a link click for campaign analytics
 */
export async function trackReferralLinkClick(refCode: string, channel: string = 'direct', campaign: string = 'general') {
  if (!refCode) return;
  try {
    const clickRef = adminDb.collection('referral_link_clicks').doc();
    await clickRef.set({
      id: clickRef.id,
      refCode: refCode.toUpperCase(),
      channel,
      campaign,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Could not log click', e);
  }
}
