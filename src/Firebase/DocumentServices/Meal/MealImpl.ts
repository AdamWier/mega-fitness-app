import Meal from './Meal';
import moment from 'moment';

export default class MealImpl implements Meal {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  create(
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

  update(
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

  delete(id: string): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('meals').doc(id).update({
      deleted: true,
      updatedAt,
    });
  }

  async findByDate(
    currentDate: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const response = await this.getByDateRef(currentDate, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  getFindByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ): Function {
    return this.getByDateRef(currentDate, uid).onSnapshot((snapshot) => {
      const updatedDocs = snapshot.docs.map(this.mapDocuments);
      updateCallback(updatedDocs);
    });
  }

  getByDateRef(
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

  async findByWeek(
    beginngingOfWeek: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const response = await this.getByWeekRef(beginngingOfWeek, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  getByWeekRef(
    beginngingOfWeek: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    const start = moment(beginngingOfWeek).startOf('week');
    const end = start.clone().endOf('week');
    console.log({ start, end });
    return this.firestore
      .collection('meals')
      .where('eatenAt', '>=', start.toDate())
      .where('eatenAt', '<', end.toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false);
  }

  mapDocuments(
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
}
