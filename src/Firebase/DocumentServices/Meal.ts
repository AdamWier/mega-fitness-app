import {
  DocumentData,
  Firestore,
  onSnapshot,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import MealDocument from '../Documents/MealDocument';
import DocumentService from './DocumentService';

export default class MealService extends DocumentService {
  constructor(firestore: Firestore) {
    super(firestore, 'meals');
  }

  public create(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date
  ): Promise<void> {
    const createdAt = new Date();
    const id = uid + '-' + createdAt.getTime() + '-' + name;
    return this.setDoc(id, {
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
    return this.updateDoc(id, {
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
    return this.updateDoc(id, {
      deleted: true,
      updatedAt,
    });
  }

  public async findByDate(
    currentDate: Date,
    uid: string
  ): Promise<MealDocument[]> {
    const ref = this.getByDateRef(currentDate, uid);
    return this.handleReponse(ref) as unknown as MealDocument[];
  }

  public getFindByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ) {
    return onSnapshot(
      this.getByDateRef(currentDate, uid),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedDocs = snapshot.docs.map(this.mapDocuments);
        updateCallback(updatedDocs);
      }
    );
  }

  private getByDateRef(currentDate: Date, uid: string) {
    const start = moment(currentDate).startOf('day');
    const end = moment(start).endOf('day');
    return this.buildQuery([
      where('eatenAt', '>=', start.toDate()),
      where('eatenAt', '<', end.toDate()),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  public async findByWeek(beginningOfWeek: Date, uid: string) {
    const ref = this.getByWeekRef(beginningOfWeek, uid);
    return this.handleReponse(ref);
  }

  private getByWeekRef(
    beginningOfWeek: Date,
    uid: string
  ): Query<DocumentData> {
    const start = moment(beginningOfWeek).startOf('isoWeek');
    const end = start.clone().endOf('isoWeek');
    return this.buildQuery([
      where('eatenAt', '>=', start.toDate()),
      where('eatenAt', '<', end.toDate()),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  public async findByDateRange(
    start: Date,
    end: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const ref = this.getByDateRangeRef(start, end, uid);
    return this.handleReponse(ref);
  }

  private getByDateRangeRef(
    start: Date,
    end: Date,
    uid: string
  ): Query<DocumentData> {
    return this.buildQuery([
      where('eatenAt', '>=', start),
      where('eatenAt', '<=', end),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  protected mapDocuments(document: QueryDocumentSnapshot<DocumentData>) {
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
