import firebase from 'firebase';
import 'firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_STORAGE_BUCKET,
} from 'react-native-dotenv';
import AuthService from './authService';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};

// eslint-disable-next-line no-unused-expressions
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const authService = new AuthService(
  firebase.auth(),
  firebase.firestore()
);
