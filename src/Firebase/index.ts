import firebase from 'firebase';
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

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const dayDocumentService = new DayDocumentService(firebase.firestore());
export const mealDocumentService = new MealDocumentService(
  firebase.firestore()
);
export const userDocumentService = new UserDocumentService(
  firebase.firestore()
);
export const shoppingListDocumentService = new ShoppingListDocumentService(
  firebase.firestore()
);

export const authService = new AuthService(
  firebase.auth(),
  userDocumentService
);
