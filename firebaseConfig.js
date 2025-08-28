import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence , browserLocalPersistence} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';

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

// Correct Auth initialization for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
