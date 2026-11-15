import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCxa4-zDT8CcOnPY6dXxHUQlnGaHwrwU90",
    authDomain: "perdidosutch.firebaseapp.com",
    projectId: "perdidosutch",
    storageBucket: "perdidosutch.firebasestorage.app",
    messagingSenderId: "691902593820",
    appId: "1:691902593820:web:3a4a9c9c41e22d23af58d9",
    measurementId: "G-SV091TKTD1"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
function createAuth() {
  if (Platform.OS === 'web') return getAuth(app);

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'auth/already-initialized'
    ) {
      return getAuth(app);
    }
    throw error;
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);