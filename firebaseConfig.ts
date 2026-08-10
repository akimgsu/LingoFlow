import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ─── Hardcoded fallback config (prevents crash when Constants.expoConfig is unavailable) ───
const firebaseConfig = {
  apiKey: "AIzaSyAUt_7c0qU30oUUuX_hmxB_lKObKWip6ro",
  authDomain: "lingo-flow-abb60.firebaseapp.com",
  projectId: "lingo-flow-abb60",
  storageBucket: "lingo-flow-abb60.firebasestorage.app",
  messagingSenderId: "985224108151",
  appId: "1:985224108151:web:0458ce99e164173b4dce72",
  measurementId: "G-B42R2REKL7",
};

// ─── Initialize Firebase safely (idempotent) ───
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
