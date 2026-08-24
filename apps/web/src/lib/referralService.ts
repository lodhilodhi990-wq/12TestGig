import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User } from '@12-test-gig/types';

export interface ReferralTier {
  id: 'bronze' | 'silver' | 'gold' | 'diamond';
  name: string;
  commissionRate: number; // e.g. 10 for 10%
  minActiveRecruits: number;
  badgeColor: string;
  badgeBg: string;
  benefits: string[];
}

export const REFERRAL_TIERS: ReferralTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    commissionRate: 10,
    minActiveRecruits: 0,
    badgeColor: 'text-amber-700',
    badgeBg: 'bg-amber-100 border-amber-200',
    benefits: ['10% Lifetime Commission on tests', 'Standard 24h Payout Processing', 'Affiliate Hub Access']
  },
  {
    id: 'silver',
    name: 'Silver Partner',
    commissionRate: 12,
    minActiveRecruits: 5,
    badgeColor: 'text-slate-700',
    badgeBg: 'bg-slate-200 border-slate-300',
    benefits: ['12% Lifetime Commission (+2% Boost)', 'Priority Support', 'Custom Campaign Tags']
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    commissionRate: 15,
    minActiveRecruits: 20,
    badgeColor: 'text-amber-800',
    badgeBg: 'bg-amber-300/60 border-amber-400',
    benefits: ['15% Lifetime Commission (+5% Boost)', 'Instant Payout Approval', 'Dedicated Partner Manager']
  },
  {
    id: 'diamond',
    name: 'Diamond Ambassador',
    commissionRate: 20,
    minActiveRecruits: 50,
    badgeColor: 'text-indigo-700',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    benefits: ['20% Maximum Lifetime Commission', 'Zero Withdrawal Fees', 'VIP Ambassador Badge', 'Custom Domain Links']
  }
];

export interface ReferredUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
  campaign?: string;
  channel?: string;
  completedTests: number;
  totalCommissionGenerated: number;
  status: 'Active Tester' | 'Pending First Test' | 'Inactive';
  qualityScore: string;
}

export interface CommissionActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  bonusCoins: number;
  status: 'Credited' | 'Processing';
  taskName?: string;
}

export interface PartnerStats {
  referralCode: string;
  totalCommissionEarned: number;
  pendingCommission: number;
  totalRecruits: number;
  activeRecruits: number;
  conversionRate: number;
  currentTier: ReferralTier;
  nextTier: ReferralTier | null;
  progressToNextTier: number; // percentage 0 - 100
  recruitsNeededForNextTier: number;
}

/**
 * Generate a clean unique referral code based on user UID or email
 */
export function generateDefaultReferralCode(user: User | null): string {
  if (!user) return 'PARTNER';
  if ((user as any).customReferralCode) {
    return (user as any).customReferralCode;
  }
  const emailPrefix = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : 'USER';
  const shortUid = user.id ? user.id.slice(0, 4).toUpperCase() : Math.floor(1000 + Math.random() * 9000).toString();
  return `${emailPrefix.slice(0, 6)}_${shortUid}`;
}

/**
 * Build the full unique dynamic URL
 */
export function buildReferralUrl(
  referralCode: string,
  campaign?: string,
  channel?: string
): string {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://12-test-gig.vercel.app';
  const url = new URL('/register', origin);
  url.searchParams.set('ref', referralCode);
  if (campaign && campaign.trim()) {
    url.searchParams.set('campaign', campaign.trim());
  }
  if (channel && channel.trim() && channel !== 'direct') {
    url.searchParams.set('channel', channel.trim());
    url.searchParams.set('utm_source', channel.trim());
  }
  return url.toString();
}

/**
 * Calculate user's tier based on active recruit count
 */
export function calculateTier(activeRecruitsCount: number): {
  currentTier: ReferralTier;
  nextTier: ReferralTier | null;
  progress: number;
  needed: number;
} {
  let currentTier = REFERRAL_TIERS[0];
  let nextTier: ReferralTier | null = REFERRAL_TIERS[1];

  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (activeRecruitsCount >= REFERRAL_TIERS[i].minActiveRecruits) {
      currentTier = REFERRAL_TIERS[i];
      nextTier = i < REFERRAL_TIERS.length - 1 ? REFERRAL_TIERS[i + 1] : null;
      break;
    }
  }

  if (!nextTier) {
    return { currentTier, nextTier: null, progress: 100, needed: 0 };
  }

  const range = nextTier.minActiveRecruits - currentTier.minActiveRecruits;
  const currentInRange = activeRecruitsCount - currentTier.minActiveRecruits;
  const progress = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  const needed = Math.max(0, nextTier.minActiveRecruits - activeRecruitsCount);

  return { currentTier, nextTier, progress, needed };
}

/**
 * Fetch real referral statistics for a user from Firestore / localStorage fallback
 */
export async function getPartnerStats(user: User | null): Promise<{
  stats: PartnerStats;
  recruits: ReferredUser[];
  recentActivity: CommissionActivity[];
}> {
  const refCode = generateDefaultReferralCode(user);

  if (!user || !user.id) {
    const defaultTier = REFERRAL_TIERS[0];
    return {
      stats: {
        referralCode: 'PARTNER',
        totalCommissionEarned: 0,
        pendingCommission: 0,
        totalRecruits: 0,
        activeRecruits: 0,
        conversionRate: 0,
        currentTier: defaultTier,
        nextTier: REFERRAL_TIERS[1],
        progressToNextTier: 0,
        recruitsNeededForNextTier: REFERRAL_TIERS[1].minActiveRecruits
      },
      recruits: [],
      recentActivity: []
    };
  }

  let realRecruits: ReferredUser[] = [];
  let realActivity: CommissionActivity[] = [];
  let customSavedCode = refCode;

  try {
    // 1. Check user doc for saved custom referral code or earnings
    const userDocRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const uData = userSnap.data();
      if (uData.referralCode) {
        customSavedCode = uData.referralCode;
      }
    }

    // 2. Query all users where referredBy == customSavedCode or user.id
    const usersRef = collection(db, 'users');
    const q1 = query(usersRef, where('referredBy', '==', customSavedCode));
    const qSnap = await getDocs(q1);

    qSnap.forEach((docSnap) => {
      const d = docSnap.data();
      const completedTests = Number(d.completedTests || d.completedGigs || 0);
      const commissionGenerated = Number(d.commissionGeneratedForReferrer || (completedTests * 20)); // approx commission
      
      realRecruits.push({
        id: docSnap.id,
        userId: docSnap.id,
        name: d.fullName || d.name || 'Anonymous Tester',
        email: d.email || 'tester@12testgig.com',
        joinedAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
        campaign: d.referralCampaign || 'Direct',
        channel: d.referralChannel || 'Organic',
        completedTests,
        totalCommissionGenerated: commissionGenerated,
        status: completedTests > 0 ? 'Active Tester' : 'Pending First Test',
        qualityScore: `${(d.trustScore ? d.trustScore / 20 : 4.8).toFixed(1)}/5`
      });

      if (completedTests > 0) {
        realActivity.push({
          id: `act_${docSnap.id}`,
          action: `App Test Completed by ${d.fullName || 'Recruit'}`,
          user: d.fullName || 'Recruit',
          time: 'Recently',
          bonusCoins: commissionGenerated > 0 ? commissionGenerated : 50,
          status: 'Credited',
          taskName: '14-Day Google Play Closed Testing'
        });
      }
    });

    // Also check localStorage for local testing sessions
    if (typeof window !== 'undefined') {
      const localRecruits = localStorage.getItem(`user_recruits_${user.id}`);
      if (localRecruits) {
        try {
          const parsed = JSON.parse(localRecruits);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((lr: ReferredUser) => {
              if (!realRecruits.some(r => r.userId === lr.userId || r.id === lr.id)) {
                realRecruits.push(lr);
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote referrals, checking local storage', err);
  }

  // Calculate metrics
  const totalRecruits = realRecruits.length;
  const activeRecruits = realRecruits.filter(r => r.completedTests > 0).length;
  const totalCommissionEarned = realRecruits.reduce((sum, r) => sum + (r.totalCommissionGenerated || 0), 0);
  const conversionRate = totalRecruits > 0 ? Math.round((activeRecruits / totalRecruits) * 1000) / 10 : 0;

  const tierCalc = calculateTier(activeRecruits);

  return {
    stats: {
      referralCode: customSavedCode,
      totalCommissionEarned,
      pendingCommission: 0,
      totalRecruits,
      activeRecruits,
      conversionRate,
      currentTier: tierCalc.currentTier,
      nextTier: tierCalc.nextTier,
      progressToNextTier: tierCalc.progress,
      recruitsNeededForNextTier: tierCalc.needed
    },
    recruits: realRecruits,
    recentActivity: realActivity
  };
}

/**
 * Save user custom referral code
 */
export async function saveCustomReferralCode(userId: string, newCode: string): Promise<boolean> {
  const sanitized = newCode.trim().replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  if (sanitized.length < 3) {
    throw new Error('Referral code must be at least 3 alphanumeric characters');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      referralCode: sanitized,
      updatedAt: new Date().toISOString()
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(`custom_referral_code_${userId}`, sanitized);
    }
    return true;
  } catch (e) {
    console.warn('Failed to update Firestore, saving locally', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`custom_referral_code_${userId}`, sanitized);
    }
    return true;
  }
}
