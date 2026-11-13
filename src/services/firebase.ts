import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

// Use initializeFirestore with experimentalAutoDetectLongPolling & ignoreUndefinedProperties
// This guarantees fallback to HTTP long-polling if WebSockets/streams are blocked in preview iframes
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    databaseId
  );
} catch {
  // If already initialized, retrieve existing firestore instance
  firestoreInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

// Validate connection to Firestore cleanly on browser boot (single read, zero writes)
if (typeof window !== 'undefined') {
  getDocFromServer(doc(db, 'settings', 'site_config')).catch((error) => {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration (client appears offline).');
    }
  });
}

export default app;
