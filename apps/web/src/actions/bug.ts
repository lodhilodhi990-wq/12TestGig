'use server';

import { adminDb } from '@/lib/firebase-admin';
import { BugStatus } from '@12-test-gig/types';

export async function updateBugStatus(bugId: string, newStatus: BugStatus, userId: string, userRole: string) {
  const bugRef = adminDb.collection('bugs').doc(bugId);
  const doc = await bugRef.get();

  if (!doc.exists) throw new Error('Bug not found');
  const oldStatus = doc.data()?.status;

  // Authorization checks based on userRole should happen here

  await bugRef.update({
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(newStatus === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
    ...(newStatus === 'closed' ? { closedAt: new Date().toISOString() } : {})
  });

  // Track History
  await adminDb.collection('bug_history').add({
    bugId,
    actorId: userId,
    actorRole: userRole,
    action: 'STATUS_CHANGED',
    oldValue: oldStatus,
    newValue: newStatus,
    createdAt: new Date().toISOString()
  });

  // Track Audit Log
  await adminDb.collection('audit_logs').add({
    actorId: userId,
    actorRole: userRole,
    organizationId: doc.data()?.organizationId,
    action: 'UPDATED_BUG_STATUS',
    entityType: 'bug',
    entityId: bugId,
    timestamp: new Date().toISOString()
  });

  return true;
}
