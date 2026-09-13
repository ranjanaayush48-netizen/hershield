import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTKmHifL1LuV4XTDsWpPe915SNw48Nf6o",
  authDomain: "hershield-fad22.firebaseapp.com",
  projectId: "hershield-fad22",
  storageBucket: "hershield-fad22.firebasestorage.app",
  messagingSenderId: "681925239710",
  appId: "1:681925239710:web:335d659d297b6dc784ec8f",
  measurementId: "G-LYW2NQY91E"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey.includes('placeholder') && 
  !firebaseConfig.apiKey.includes('<')
);

// Only initialize if configured to prevent FirebaseError on empty config
const app = isFirebaseConfigured ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;

export const auth = (app ? getAuth(app) : null) as unknown as ReturnType<typeof getAuth>;
