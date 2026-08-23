'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { campaignSchema } from '@12-test-gig/validation';
import { Campaign, CampaignStatus, AuditLog } from '@12-test-gig/types';
// Note: We need firebase-admin initialized somewhere. We'll assume a lib/firebase-admin.ts exists.
import { adminDb } from '@/lib/firebase-admin';

export async function createCampaign(data: any, userId: string, organizationId: string) {
  // 1. Validate data using Zod
  const validated = campaignSchema.parse(data);
  
  // 2. Server-side budget calculation
  const totalBudget = validated.requiredTesters * validated.rewardPerTester;

  // 3. Create document
  const campaignRef = adminDb.collection('campaigns').doc();
  const campaignData: Campaign = {
    id: campaignRef.id,
    organizationId,
    projectId: 'tmp-project-id', // Would be fetched or passed
    appId: validated.appId,
    name: validated.name,
    description: validated.description || '',
    objective: validated.objective || '',
    platform: 'Android', // From App doc
    durationValue: validated.durationValue,
    durationUnit: 'days',
    startDate: validated.startDate,
    endDate: validated.endDate,
    requiredTesters: validated.requiredTesters,
    rewardPerTester: validated.rewardPerTester,
    totalBudget,
    difficulty: validated.difficulty,
    testerRequirements: {
      experienceLevel: 'any',
      devices: [],
      androidVersions: [],
      languages: [],
    },
    instructions: validated.instructions,
    status: 'draft',
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await campaignRef.set(campaignData);

  // 4. Audit Log
  await adminDb.collection('audit_logs').add({
    actorId: userId,
    actorRole: 'customer',
    organizationId,
    action: 'CREATED_CAMPAIGN',
    entityType: 'campaign',
    entityId: campaignRef.id,
    timestamp: new Date().toISOString(),
  });

  return campaignData;
}

export async function submitCampaign(campaignId: string, userId: string, organizationId: string) {
  const campaignRef = adminDb.collection('campaigns').doc(campaignId);
  const doc = await campaignRef.get();
  
  if (!doc.exists) throw new Error('Campaign not found');
  const data = doc.data() as Campaign;
  
  if (data.organizationId !== organizationId) throw new Error('Unauthorized');
  if (data.status !== 'draft' && data.status !== 'rejected') throw new Error('Invalid state transition');

  await campaignRef.update({
    status: 'pending_review',
    updatedAt: new Date().toISOString()
  });

  await adminDb.collection('audit_logs').add({
    actorId: userId,
    actorRole: 'customer',
    organizationId,
    action: 'SUBMITTED_CAMPAIGN',
    entityType: 'campaign',
    entityId: campaignId,
    timestamp: new Date().toISOString(),
  });

  return true;
}
