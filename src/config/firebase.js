import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAnalytics, 
  logEvent, 
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Analytics
const analytics = getAnalytics(app);

// Enable analytics collection (automatic collection of standard metrics)
// This ensures: active users, new users, country, sessions, engagement rate, etc.
setAnalyticsCollectionEnabled(true);

// Set up user tracking for better analytics
const initializeAnalyticsUser = async () => {
  try {
    // Get or create a unique user ID
    let userId = await AsyncStorage.getItem('analytics_user_id');
    if (!userId) {
      // Generate a unique user ID based on timestamp
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('analytics_user_id', userId);
    }
    
    // Set the user ID for analytics
    setUserId(userId);
    
    // Set custom user properties
    setUserProperties({
      app_version: '1.0.0',
      user_type: 'student',
    });
    
    // Log initial app launch
    logEvent(analytics, 'first_session', {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Error initializing analytics user:', error);
  }
};

// Initialize analytics user
initializeAnalyticsUser();

export default app;
export { analytics, logEvent, setUserProperties };