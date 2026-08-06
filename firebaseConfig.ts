import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from 'expo-constants';

// Load Firebase configuration from app.json (extra) like weather-todo
const firebaseExtra = Constants.expoConfig?.extra?.firebase || Constants.manifest?.extra?.firebase || {};

const firebaseConfig = {
  apiKey: firebaseExtra.apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseExtra.authDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseExtra.projectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: firebaseExtra.storageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseExtra.messagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseExtra.appId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: firebaseExtra.measurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App safely (prevent duplicate app error during hot reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
