/**
 * Firebase 서비스 Export
 * 모든 Firebase 관련 서비스를 한 곳에서 export
 */

export { app, auth, db, storage, analytics } from './config';
export type { FirebaseApp } from 'firebase/app';
export type { Auth } from 'firebase/auth';
export type { Firestore } from 'firebase/firestore';
export type { FirebaseStorage } from 'firebase/storage';
export type { Analytics } from 'firebase/analytics';

