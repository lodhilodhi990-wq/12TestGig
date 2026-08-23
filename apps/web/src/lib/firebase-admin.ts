import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const apps = getApps();

if (!apps.length) {
  // Use environment variables for admin credentials.
  // In development/Phase 1, if these are missing, we might use default credentials
  // or mock it if strictly required. 
  
  if (process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Fallback for emulator / local development without service account
    initializeApp();
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
