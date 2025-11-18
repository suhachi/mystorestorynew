/**
 * Firebase Configuration
 * MyStoreStory Firebase 초기화 및 설정
 * 
 * 환경 변수:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_GA_MEASUREMENT_ID
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mystorestory.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mystorestory',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mystorestory.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '102904078280',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
};

// Firebase 앱 초기화
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Analytics는 브라우저 환경에서만 초기화
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Firebase Analytics 초기화 실패:', error);
    }
  }
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
  throw error;
}

// Firebase 서비스 export
export { app, auth, db, storage, analytics };
export default app;

