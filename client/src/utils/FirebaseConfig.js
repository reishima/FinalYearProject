import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjgXhS6U4VqkbbyHTrHEVbBdv6sxKuLGc",
  authDomain: "blockchain-matricid-fyp.firebaseapp.com",
  projectId: "blockchain-matricid-fyp",
  storageBucket: "blockchain-matricid-fyp.appspot.com",
  messagingSenderId: "854753139151",
  appId: "1:854753139151:web:16e46a02bd32878b0f5aba",
  measurementId: "G-KMKZCYMB7G"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getFirestore(app)
export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).then(() => {
}).catch((error) => {
    console.error("Error setting local persistence: ", error);
})

