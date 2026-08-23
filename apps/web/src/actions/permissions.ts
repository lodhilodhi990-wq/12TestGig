'use server';

import { adminDb } from '@/lib/firebase-admin';

export type AdminRole = 'super_admin' | 'admin' | 'support_admin' | 'moderator' | 'finance_admin' | 'finance_viewer' | 'analyst';

export type Permission = 
  | 'users.view' | 'users.manage'
  | 'testers.view' | 'testers.manage'
  | 'customers.view' | 'customers.manage'
  | 'organizations.view' | 'organizations.manage'
  | 'campaigns.view' | 'campaigns.manage'
  | 'apps.view' | 'apps.manage'
  | 'testing.view' | 'testing.manage'
  | 'rewards.view' | 'rewards.manage'
  | 'wallets.view' | 'wallets.manage'
  | 'withdrawals.view' | 'withdrawals.manage'
  | 'disputes.view' | 'disputes.manage'
  | 'moderation.view' | 'moderation.manage'
  | 'risk.view' | 'risk.manage'
  | 'audit.view'
  | 'reports.view'
  | 'settings.manage'
  | 'analytics.view' | 'analytics.export'
  | 'finance.analytics.view'
  | 'risk.analytics.view'
  | 'admin.analytics.view'
  | 'operations.view' | 'operations.manage'
  | 'incidents.view' | 'incidents.manage'
  | 'backups.view'
  | 'releases.manage'
  | 'feature_flags.manage';

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    'users.view', 'users.manage', 'testers.view', 'testers.manage', 'customers.view', 'customers.manage',
    'organizations.view', 'organizations.manage', 'campaigns.view', 'campaigns.manage', 'apps.view', 'apps.manage',
    'testing.view', 'testing.manage', 'rewards.view', 'rewards.manage', 'wallets.view', 'wallets.manage',
    'withdrawals.view', 'withdrawals.manage', 'disputes.view', 'disputes.manage', 'moderation.view', 'moderation.manage',
    'risk.view', 'risk.manage', 'audit.view', 'reports.view', 'settings.manage',
    'analytics.view', 'analytics.export', 'finance.analytics.view', 'risk.analytics.view', 'admin.analytics.view',
    'operations.view', 'operations.manage', 'incidents.view', 'incidents.manage', 'backups.view', 'releases.manage', 'feature_flags.manage'
  ],
  admin: [
    'users.view', 'testers.view', 'customers.view', 'organizations.view', 'campaigns.view', 'apps.view',
    'testing.view', 'rewards.view', 'wallets.view', 'withdrawals.view', 'disputes.view', 'moderation.view',
    'risk.view', 'audit.view', 'reports.view',
    'analytics.view', 'analytics.export', 'admin.analytics.view',
    'operations.view', 'incidents.view', 'incidents.manage'
  ],
  support_admin: [
    'users.view', 'testers.view', 'customers.view', 'organizations.view', 'disputes.view', 'disputes.manage',
    'analytics.view'
  ],
  moderator: [
    'testers.view', 'moderation.view', 'moderation.manage', 'testing.view', 'campaigns.view',
    'analytics.view'
  ],
  finance_admin: [
    'rewards.view', 'rewards.manage', 'wallets.view', 'wallets.manage', 'withdrawals.view', 'withdrawals.manage', 'risk.view',
    'finance.analytics.view', 'analytics.export'
  ],
  finance_viewer: [
    'rewards.view', 'wallets.view', 'withdrawals.view',
    'finance.analytics.view'
  ],
  analyst: [
    'reports.view', 'campaigns.view', 'testing.view',
    'analytics.view', 'analytics.export', 'admin.analytics.view'
  ]
};

export async function requirePermission(adminId: string, permission: Permission) {
  const userDoc = await adminDb.collection('users').doc(adminId).get();
  if (!userDoc.exists) throw new Error('Unauthorized');
  
  const userData = userDoc.data();
  if (!userData?.roles || !Array.isArray(userData.roles)) {
    throw new Error('Forbidden: No roles assigned');
  }

  const userRoles: AdminRole[] = userData.roles;
  const hasPermission = userRoles.some(role => ROLE_PERMISSIONS[role]?.includes(permission));

  if (!hasPermission) {
    throw new Error(`Forbidden: Missing required permission '${permission}'`);
  }

  return true;
}
