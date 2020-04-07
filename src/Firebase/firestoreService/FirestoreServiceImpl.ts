import firebase from 'firebase';
import FirestoreService from './FirestoreService';

export default class FirestoreServiceImpl implements FirestoreService {
  firestore: firebase.firestore.Firestore;

  constructor(
    firestore: firebase.firestore.Firestore
  ) {
    this.firestore = firestore;
  }

  saveMeal(meal: Array<any>, mealName: string, uid: string, date: Date, calories: number): Promise<void> {
    return this.firestore.collection('meals').doc(mealName+'-'+uid+'-'+date.getTime()).set({
        meal,
        eatenAt: date,
        createdAt: date,
        deleted: false,
        uid,
        totalCalories: calories,
        mealName
    });
  }

  saveUser(user: {uid: string, email: string}): Promise<void> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  };
}
