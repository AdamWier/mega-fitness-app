import firebase from 'firebase';
import { FirestoreService, DayDocument } from './FirestoreService';
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
      return response.docs.map(this.mapMealDocuments);
    }
    return [];
  }

  getFindMealsByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ): Function {
    return this.getMealsByDateRef(currentDate, uid).onSnapshot((snapshot) => {
      const updatedDocs = snapshot.docs.map(this.mapMealDocuments);
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

  mapMealDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >
  ): { [key: string]: any } {
    const data = document.data();
    const { eatenAt, meal, name } = data;
    return {
      id: document.id,
      eatenAt: eatenAt.toDate(),
      meal,
      name,
    };
  }

  saveUser({ uid, email }: { uid: string; email: string }): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('users').doc(uid).set({
      uid,
      email,
      createdAt,
    });
  }

  createDayGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string
  ): Promise<void> {
    const dayStartMoment = moment(currentDate).startOf('day');
    const date = dayStartMoment.toDate();
    const createdAt = new Date();
    return this.firestore
      .collection('days')
      .doc(
        uid +
          '-' +
          dayStartMoment.format('YYYY-MM-DD') +
          '-' +
          createdAt.getTime()
      )
      .set({
        date,
        goalCalories,
        uid,
        createdAt,
        deleted: false,
      });
  }

  updateDayGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string,
    id: string
  ): Promise<void> {
    const date = moment(currentDate).startOf('day').toDate();
    const updatedAt = new Date();
    return this.firestore.collection('days').doc(id).set({
      date,
      goalCalories,
      uid,
      updatedAt,
      deleted: false,
    });
  }

  async findDayDocument(date: Date, uid: string): Promise<DayDocument> {
    const response = await this.getDayDocumentReference(date, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDayDocuments)[0];
    }
    return {
      id: null,
      goalCalories: null,
    };
  }

  getDayDocumentListener(
    date: Date,
    uid: string,
    updateCallback: Function
  ): Function {
    return this.getDayDocumentReference(date, uid).onSnapshot((snapshot) => {
      const updatedDocs = snapshot.docs.map(this.mapDayDocuments)[0];
      updateCallback(updatedDocs);
    });
  }

  getDayDocumentReference(
    date: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    return this.firestore
      .collection('days')
      .where('date', '==', moment(date).startOf('day').toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false)
      .limit(1);
  }

  mapDayDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >
  ): DayDocument {
    const data = document.data();
    return {
      id: document.id,
      goalCalories: data.goalCalories,
    };
  }

  updateUserCalorieGoal(uid: string, goalCalories: number): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('users').doc(uid).update({
      goalCalories,
      updatedAt,
    });
  }
}
