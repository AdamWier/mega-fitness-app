import moment from 'moment';

export default class MealService {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  public create(
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
        name: name || 'Untitled',
        uid,
        eatenAt,
        createdAt,
        deleted: false,
      });
  }

  public update(
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
        name: name || 'Untitled',
        updatedAt,
      });
  }

  public delete(id: string) {
    const updatedAt = new Date();
    return this.firestore.collection('meals').doc(id).update({
      deleted: true,
      updatedAt,
    });
  }

  public async findByDate(currentDate: Date, uid: string) {
    const response = await this.getByDateRef(currentDate, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  public getFindByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ) {
    return this.getByDateRef(currentDate, uid).onSnapshot((snapshot) => {
      const updatedDocs = snapshot.docs.map(this.mapDocuments);
      updateCallback(updatedDocs);
    });
  }

  private getByDateRef(currentDate: Date, uid: string) {
    const start = moment(currentDate).startOf('day');
    const end = moment(start).endOf('day');
    return this.firestore
      .collection('meals')
      .where('eatenAt', '>=', start.toDate())
      .where('eatenAt', '<', end.toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false);
  }

  public async findByWeek(beginningOfWeek: Date, uid: string) {
    const response = await this.getByWeekRef(beginningOfWeek, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  private getByWeekRef(
    beginningOfWeek: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    const start = moment(beginningOfWeek).startOf('isoWeek');
    const end = start.clone().endOf('isoWeek');
    return this.firestore
      .collection('meals')
      .where('eatenAt', '>=', start.toDate())
      .where('eatenAt', '<', end.toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false);
  }

  public async findByDateRange(
    start: Date,
    end: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const response = await this.getByDateRangeRef(start, end, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  private getByDateRangeRef(
    start: Date,
    end: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    return this.firestore
      .collection('meals')
      .where('eatenAt', '>=', start)
      .where('eatenAt', '<=', end)
      .where('uid', '==', uid)
      .where('deleted', '==', false);
  }

  private mapDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ) {
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
