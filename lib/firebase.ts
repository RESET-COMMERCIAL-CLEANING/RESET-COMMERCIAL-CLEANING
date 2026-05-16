import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDB7h85_b3GxdPlmLHrm1iqgRYIpNSyesg",
  authDomain: "reset-commercial-cleaning.firebaseapp.com",
  projectId: "reset-commercial-cleaning",
  storageBucket: "reset-commercial-cleaning.firebasestorage.app",
  messagingSenderId: "562251351172",
  appId: "1:562251351172:web:60925a004a26765b282ed1",
  measurementId: "G-4HM299ENG9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
