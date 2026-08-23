'use server';

import { adminDb } from '@/lib/firebase-admin';
import { PlayStoreChecklist, ChecklistItem, ChecklistStatus } from '@12-test-gig/types';

/**
 * Initializes a new Play Store Readiness Checklist for an app if it doesn't exist.
 */
export async function initializeChecklist(userId: string, organizationId: string, appId: string) {
  // Check authorization here (omitted for brevity, assume caller validated ownership)
  
  const checklistRef = adminDb.collection('play_store_checklists').doc(appId);
  const doc = await checklistRef.get();
  
  if (doc.exists) return doc.data();

  // Create default checklist
  const defaultItems: ChecklistItem[] = [
    { id: 'item_1', category: 'App Identity', title: 'Package Name Valid', description: 'Ensure no generic package names.', required: true, status: 'not_started', updatedAt: new Date().toISOString(), updatedBy: userId },
    { id: 'item_2', category: 'Privacy', title: 'Privacy Policy URL', description: 'A valid URL accessible to users.', required: true, status: 'not_started', updatedAt: new Date().toISOString(), updatedBy: userId },
    { id: 'item_3', category: 'Testing', title: 'Closed Testing Track', description: '20 testers for 14 days completed.', required: true, status: 'not_started', updatedAt: new Date().toISOString(), updatedBy: userId },
  ];

  const checklist: PlayStoreChecklist = {
    id: appId,
    appId,
    organizationId,
    items: defaultItems,
    readinessPercentage: 0,
    updatedAt: new Date().toISOString()
  };

  await checklistRef.set(checklist);
  return checklist;
}

/**
 * Updates a specific checklist item.
 */
export async function updateChecklistItem(userId: string, appId: string, itemId: string, status: ChecklistStatus, evidence?: string) {
  const checklistRef = adminDb.collection('play_store_checklists').doc(appId);
  
  await adminDb.runTransaction(async (t) => {
    const doc = await t.get(checklistRef);
    if (!doc.exists) throw new Error('Checklist not found');

    const data = doc.data() as PlayStoreChecklist;
    let completedRequired = 0;
    let totalRequired = 0;

    const updatedItems = data.items.map((item: ChecklistItem) => {
      if (item.required) totalRequired++;
      
      if (item.id === itemId) {
        if (item.required && status === 'completed') completedRequired++;
        return { ...item, status, evidence, updatedAt: new Date().toISOString(), updatedBy: userId };
      }
      
      if (item.required && item.status === 'completed') completedRequired++;
      return item;
    });

    const readinessPercentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

    t.update(checklistRef, {
      items: updatedItems,
      readinessPercentage,
      updatedAt: new Date().toISOString()
    });
  });
}
