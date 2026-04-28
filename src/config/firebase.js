import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyACliYLjkr_XXH7iRydC-EB6Hwkio4QZIo',
  authDomain: 'math-mutiplication.firebaseapp.com',
  projectId: 'math-mutiplication',
  storageBucket: 'math-mutiplication.firebasestorage.app',
  messagingSenderId: '867450541802',
  appId: '1:867450541802:android:2a4be2dfdda485c620a993',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);

export default app;