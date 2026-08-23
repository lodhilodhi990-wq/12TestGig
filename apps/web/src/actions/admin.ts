'use server';

import { adminDb } from '@/lib/firebase-admin';
import { requirePermission } from './permissions';
import { UserRestriction, RiskEvent, RiskSeverity, AdminNote, RestrictionType } from '@12-test-gig/types';

/**
 * Suspends an account entirely.
 */
export async function suspendUser(adminId: string, userId: string, reason: string) {
  await requirePermission(adminId, 'users.manage');

  await adminDb.runTransaction(async (transaction) => {
    const userRef = adminDb.collection('users').doc(userId);
    transaction.update(userRef, {
      status: 'suspended',
      updatedAt: new Date().toISOString()
    });

    const noteRef = adminDb.collection('admin_notes').doc();
    const note: AdminNote = {
      id: noteRef.id,
      adminId,
      targetType: 'user',
      targetId: userId,
      note: `User suspended. Reason: ${reason}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    transaction.set(noteRef, note);

    const auditRef = adminDb.collection('audit_logs').doc();
    transaction.set(auditRef, {
      id: auditRef.id,
      actor: adminId,
      action: 'suspend_user',
      target: userId,
      reason,
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * Restricts a specific capability of a user.
 */
export async function addRestriction(adminId: string, userId: string, type: RestrictionType, reason: string) {
  await requirePermission(adminId, 'users.manage');

  const restrictionRef = adminDb.collection('user_restrictions').doc();
  const restriction: UserRestriction = {
    id: restrictionRef.id,
    userId,
    type,
    status: 'active',
    reason,
    createdBy: adminId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await adminDb.runTransaction(async (transaction) => {
    transaction.set(restrictionRef, restriction);

    const auditRef = adminDb.collection('audit_logs').doc();
    transaction.set(auditRef, {
      id: auditRef.id,
      actor: adminId,
      action: 'add_restriction',
      target: userId,
      reason,
      metadata: { type },
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * Logs an internal private admin note.
 */
export async function addAdminNote(adminId: string, targetType: string, targetId: string, text: string) {
  await requirePermission(adminId, 'users.view'); // Base permission to see notes implies ability to write them

  const noteRef = adminDb.collection('admin_notes').doc();
  const note: AdminNote = {
    id: noteRef.id,
    adminId,
    targetType,
    targetId,
    note: text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await noteRef.set(note);
}

/**
 * Flags a user for suspicious activity.
 */
export async function createRiskEvent(userId: string, type: string, severity: RiskSeverity, description: string) {
  const eventRef = adminDb.collection('risk_events').doc();
  const event: RiskEvent = {
    id: eventRef.id,
    userId,
    type,
    severity,
    description,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  await eventRef.set(event);
}
