import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkSVishM4CN55DoMh9g_mMzO5OJyX05js",
  authDomain: "test-gig-3ac2c.firebaseapp.com",
  projectId: "test-gig-3ac2c",
  storageBucket: "test-gig-3ac2c.firebasestorage.app",
  messagingSenderId: "1024362047517",
  appId: "1:1024362047517:web:ec8b7d030682b92c593ef4",
  measurementId: "G-0D06P6EHR4",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
