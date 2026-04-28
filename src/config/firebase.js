import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyACliYLjkr_XXH7iRydC-EB6Hwkio4QZIo',
  authDomain: 'math-mutiplication.firebaseapp.com',
  projectId: 'math-mutiplication',
  storageBucket: 'math-mutiplication.firebasestorage.app',
  messagingSenderId: '867450541802',
  appId: '1:867450541802:android:2a4be2dfdda485c620a993',
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export default app;