import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDoQH-6kjBi3FDs9M50JJdmr9uCLfK9lVY",
  authDomain: "baberpro-31c40.firebaseapp.com",
  projectId: "baberpro-31c40",
  storageBucket: "baberpro-31c40.firebasestorage.app",
  messagingSenderId: "559665774528",
  appId: "1:559665774528:web:c8250dd76513d68b539225"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (e) {
    console.log('Emulators not available');
  }
}

export default app;
