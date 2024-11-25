import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Default configuration for development
const defaultConfig = {
  apiKey: "AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",
  authDomain: "kingdomrunnersdv1.firebaseapp.com",
  projectId: "kingdomrunnersdv1",
  storageBucket: "kingdomrunnersdv1.appspot.com",
  messagingSenderId: "626559745548",
  appId: "1:626559745548:web:3e2f5d7498f7e3beb1f829",
  measurementId: "G-0G8N8DZWHW"
};

// Use environment variables if available, otherwise fall back to default config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with persistence
const db = getFirestore(firebase_app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}

// Initialize Analytics conditionally (only in browser)
const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(firebase_app) : null) : null;

export { firebase_app, db, analytics };