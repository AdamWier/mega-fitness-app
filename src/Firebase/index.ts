import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_STORAGE_BUCKET,
} from 'react-native-dotenv';
import AuthService from './AuthService';
import DayDocumentService from './DocumentServices/Day';
import MealDocumentService from './DocumentServices/Meal';
import UserDocumentService from './DocumentServices/User';
import ShoppingListDocumentService from './DocumentServices/ShoppingList';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};

// eslint-disable-next-line jest/require-hook
initializeApp(firebaseConfig);

export const dayDocumentService = new DayDocumentService(getFirestore());
export const mealDocumentService = new MealDocumentService(getFirestore());
export const userDocumentService = new UserDocumentService(getFirestore());
export const shoppingListDocumentService = new ShoppingListDocumentService(
  getFirestore()
);

export const authService = new AuthService(getAuth(), userDocumentService);
