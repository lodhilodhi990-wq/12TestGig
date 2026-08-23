'use server';

import { adminDb } from '@/lib/firebase-admin';
import { requirePermission } from './permissions';
import { ReportJob } from '@12-test-gig/types';

/**
 * Triggers a background report generation job.
 */
export async function queueReportJob(adminId: string, type: ReportJob['type'], filters: Record<string, any>) {
  // Validate permission based on report type
  if (type === 'withdrawals' || type === 'rewards') {
    await requirePermission(adminId, 'analytics.export');
  } else {
    await requirePermission(adminId, 'analytics.view');
  }

  const jobRef = adminDb.collection('report_jobs').doc();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Reports expire after 7 days

  const job: ReportJob = {
    id: jobRef.id,
    userId: adminId,
    type,
    filters,
    status: 'queued',
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await jobRef.set(job);

  // In a real production system, this document creation would trigger a Cloud Function 
  // or a background worker (e.g. BullMQ) to actually generate the CSV and update the status.
  // For this phase, we mock the background processing via a scheduled update.

  return job.id;
}
