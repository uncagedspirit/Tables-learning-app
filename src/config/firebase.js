import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// app init
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// auth init with persistence (safe)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Auth already initialized, just get it
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };

export const database = getDatabase(app);
export const db = getFirestore(app);

export default app;