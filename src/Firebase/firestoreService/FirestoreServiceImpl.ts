import firebase from 'firebase';
import FirestoreService from './FirestoreService';

export default class FirestoreServiceImpl implements FirestoreService {
  firestore: firebase.firestore.Firestore;

  constructor(
    firestore: firebase.firestore.Firestore
  ) {
    this.firestore = firestore;
  }

  saveMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date, totalCalories: number): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('meals').doc(uid+'-'+createdAt.getTime()+'-'+mealName).set({
      meal,
      eatenAt,
      createdAt,
      deleted: false,
      uid,
      totalCalories,
      mealName
    });
  }

  saveUser(user: {uid: string, email: string}): Promise<void> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  };
}
