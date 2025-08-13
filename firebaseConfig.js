import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdC-1CBj2YikqSO2ebjSziCRE5QzaB7Hc",
  authDomain: "couching-guru-3c9a4.firebaseapp.com",
  projectId: "couching-guru-3c9a4",
  storageBucket: "couching-guru-3c9a4.firebasestorage.app",
  messagingSenderId: "687365860101",
  appId: "1:687365860101:web:b6a971129852ddaa57a56c",
  measurementId: "G-8XHMS3CSN3" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

isSupported().then((supported) => {
  if (supported) { 
    const analytics = getAnalytics(app);
    console.log("🚀 Firebase Analytics is ready to collect data!");
  } else { 
    console.warn("🚫 Firebase Analytics cannot be initialized. Browser environment does not support it (e.g., cookies disabled, IndexedDB unavailable).");
  }
}).catch(error => {
    console.error("🚨 Error checking Firebase Analytics support:", error);
});

