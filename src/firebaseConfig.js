import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig =
  JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG) ??
  JSON.parse(process.env.VITE_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
