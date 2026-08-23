'use server';

import { adminDb } from '@/lib/firebase-admin';

export async function createNotification(userId: string, title: string, message: string, type: string, referenceId?: string) {
  const notifRef = adminDb.collection('notifications').doc();
  await notifRef.set({
    id: notifRef.id,
    userId,
    title,
    message,
    type,
    referenceId,
    read: false,
    createdAt: new Date().toISOString()
  });
}
