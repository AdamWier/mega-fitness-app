import firebase from 'firebase';
import FirestoreService from './FirestoreService';
import moment from 'moment';

export default class FirestoreServiceImpl implements FirestoreService {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  createMeal(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date
  ): Promise<void> {
    const createdAt = new Date();
    return this.firestore
      .collection('meals')
      .doc(uid + '-' + createdAt.getTime() + '-' + name)
      .set({
        meal,
        name,
        uid,
        eatenAt,
        createdAt,
        deleted: false,
      });
  }

  updateMeal(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date,
    id: string
  ): Promise<void> {
    const updatedAt = new Date();
    return this.firestore
      .collection('meals')
      .doc(id)
      .update({
        meal,
        eatenAt,
        deleted: false,
        uid,
        name: name === '' ? 'Untitled' : name,
        updatedAt,
      });
  }

  deleteMeal(id: string): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('meals').doc(id).update({
      deleted: true,
      updatedAt,
    });
  }

  async findMealsByDate(
    currentDate: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const response = await this.getMealsByDateRef(currentDate, uid).get();
    if (response.docs.length) {
      return response.docs.map((doc) => {
        const data = doc.data();
        const { eatenAt, meal, name } = data;
        return {
          id: doc.id,
          eatenAt: eatenAt.toDate(),
          meal,
          name,
        };
      });
    }
    return null;
  }

  getFindMealsByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ): Function {
    return this.getMealsByDateRef(currentDate, uid).onSnapshot((snapshot) => {
      const updatedDocs = snapshot.docs.map((doc) => {
        const data = doc.data();
        const { eatenAt, meal, name } = data;
        return {
          id: doc.id,
          eatenAt: eatenAt.toDate(),
          meal,
          name,
        };
      });
      updateCallback(updatedDocs);
    });
  }

  getMealsByDateRef(
    currentDate: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    const start = moment(currentDate).startOf('day');
    const end = moment(start).endOf('day');
    return this.firestore
      .collection('meals')
      .where('eatenAt', '>=', start.toDate())
      .where('eatenAt', '<', end.toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false);
  }

  saveUser(user: { uid: string; email: string }): Promise<void> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }
}
