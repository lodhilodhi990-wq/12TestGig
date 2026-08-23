'use server';

import { adminDb } from '@/lib/firebase-admin';
import { requirePermission } from './permissions';

// ----------------------------------------------------------------------
// ADMIN ANALYTICS
// ----------------------------------------------------------------------
export async function getAdminOverviewMetrics(adminId: string) {
  await requirePermission(adminId, 'analytics.view');

  const usersQuery = adminDb.collection('users');
  const testersQuery = usersQuery.where('roles', 'array-contains', 'tester');
  const campaignsQuery = adminDb.collection('campaigns');
  
  // Use Firestore aggregation queries to avoid loading entire collections into memory
  const totalUsersSnapshot = await usersQuery.count().get();
  const totalTestersSnapshot = await testersQuery.count().get();
  const activeCampaignsSnapshot = await campaignsQuery.where('status', '==', 'running').count().get();
  
  const bugsQuery = adminDb.collection('bug_reports');
  const validBugsSnapshot = await bugsQuery.where('status', '==', 'approved').count().get();

  return {
    totalUsers: totalUsersSnapshot.data().count,
    activeTesters: totalTestersSnapshot.data().count,
    activeCampaigns: activeCampaignsSnapshot.data().count,
    validBugs: validBugsSnapshot.data().count,
  };
}

export async function getAdminFinancialMetrics(adminId: string) {
  await requirePermission(adminId, 'finance.analytics.view');

  const withdrawalsQuery = adminDb.collectionGroup('withdrawal_requests');
  
  // Example of fetching recent data and aggregating in memory (since Firestore sum() over group collections might require specific indexes)
  // For production with massive data, we'd use .sum() where possible.
  const completedWithdrawals = await withdrawalsQuery.where('status', '==', 'completed').count().get();

  return {
    completedWithdrawalsCount: completedWithdrawals.data().count,
    // totalAmount: ... (Use .sum() in the future)
  };
}

// ----------------------------------------------------------------------
// ORGANIZATION/CUSTOMER ANALYTICS
// ----------------------------------------------------------------------
export async function getOrganizationMetrics(userId: string, organizationId: string) {
  // Validate ownership
  const orgDoc = await adminDb.collection('organizations').doc(organizationId).get();
  if (!orgDoc.exists || orgDoc.data()?.ownerId !== userId) {
    throw new Error('Forbidden: You do not own this organization');
  }

  const campaignsQuery = adminDb.collection('campaigns').where('organizationId', '==', organizationId);
  const campaignsSnapshot = await campaignsQuery.get();
  
  const totalCampaigns = campaignsSnapshot.size;
  const activeCampaigns = campaignsSnapshot.docs.filter(d => d.data().status === 'running').length;

  return {
    totalCampaigns,
    activeCampaigns,
  };
}

// ----------------------------------------------------------------------
// TESTER ANALYTICS
// ----------------------------------------------------------------------
export async function getTesterPerformance(userId: string) {
  // A tester can only see their own stats
  
  const tasksQuery = adminDb.collectionGroup('tasks').where('assignedTo', '==', userId);
  const bugsQuery = adminDb.collectionGroup('bug_reports').where('testerId', '==', userId);

  const completedTasks = await tasksQuery.where('status', '==', 'completed').count().get();
  const validBugs = await bugsQuery.where('status', '==', 'approved').count().get();

  return {
    completedTasks: completedTasks.data().count,
    validBugs: validBugs.data().count,
  };
}
