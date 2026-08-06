import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Shared Firebase configuration from weather-todo
const firebaseConfig = {
  apiKey: "AIzaSyDAZ7nZp2BRLXwqMA1UhtUYFCV4JxVJ6PY",
  authDomain: "my-test-app-d6bf1.firebaseapp.com",
  projectId: "my-test-app-d6bf1",
  storageBucket: "my-test-app-d6bf1.firebasestorage.app",
  messagingSenderId: "929172190792",
  appId: "1:929172190792:web:31f347c3761214ee96ca7d",
  measurementId: "G-BMR390PZ3Q"
};

// Initialize Firebase App safely (prevent duplicate app error during hot reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
