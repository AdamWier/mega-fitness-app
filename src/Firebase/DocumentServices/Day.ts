import { Unsubscribe } from 'firebase/auth';
import {
  DocumentData,
  Firestore,
  limit,
  onSnapshot,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import DayDocument from '../Documents/DayDocument';
import DocumentService from './DocumentService';

export default class DayService extends DocumentService {
  constructor(firestore: Firestore) {
    super(firestore, 'days');
  }

  public createGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string
  ): Promise<void> {
    const dayStartMoment = moment(currentDate).startOf('day');
    const date = dayStartMoment.toDate();
    const createdAt = new Date();
    const id = `${uid}-${dayStartMoment.format(
      'YYYY-MM-DD'
    )}-${createdAt.getTime()}`;

    return this.setDoc(id, {
      date,
      goalCalories,
      uid,
      createdAt,
      deleted: false,
    });
  }

  public updateGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string,
    id: string
  ): Promise<void> {
    const date = moment(currentDate).startOf('day').toDate();
    const updatedAt = new Date();
    return this.updateDoc(id, {
      date,
      goalCalories,
      uid,
      updatedAt,
      deleted: false,
    });
  }

  public createWeight(
    currentDate: Date,
    weight: number,
    uid: string
  ): Promise<void> {
    const dayStartMoment = moment(currentDate).startOf('day');
    const date = dayStartMoment.toDate();
    const createdAt = new Date();
    const id = `${uid}-${dayStartMoment.format(
      'YYYY-MM-DD'
    )}-${createdAt.getTime()}`;
    return this.setDoc(id, {
      date,
      weight,
      uid,
      createdAt,
      deleted: false,
    });
  }

  public updateWeight(
    currentDate: Date,
    weight: number,
    uid: string,
    id: string
  ): Promise<void> {
    const date = moment(currentDate).startOf('day').toDate();
    const updatedAt = new Date();
    return this.updateDoc(id, {
      date,
      weight,
      uid,
      updatedAt,
      deleted: false,
    });
  }

  public createWater(
    currentDate: Date,
    water: number,
    uid: string
  ): Promise<void> {
    const dayStartMoment = moment(currentDate).startOf('day');
    const date = dayStartMoment.toDate();
    const createdAt = new Date();
    const id = `${uid}-${dayStartMoment.format(
      'YYYY-MM-DD'
    )}-${createdAt.getTime()}`;
    return this.setDoc(id, {
      date,
      water,
      uid,
      createdAt,
      deleted: false,
    });
  }

  public updateWater(
    currentDate: Date,
    water: number,
    uid: string,
    id: string
  ): Promise<void> {
    const date = moment(currentDate).startOf('day').toDate();
    const updatedAt = new Date();
    return this.updateDoc(id, {
      date,
      water,
      uid,
      updatedAt,
      deleted: false,
    });
  }

  public async findDocument(date: Date, uid: string): Promise<DayDocument> {
    const ref = this.getDocumentReference(date, uid);
    const response = await this.query(ref);
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments)[0];
    }
    return {};
  }

  public getDocumentListener(
    date: Date,
    uid: string,
    updateCallback: Function
  ): Unsubscribe {
    return onSnapshot(
      this.getDocumentReference(date, uid),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedDocs = snapshot.docs.map(this.mapDocuments)[0];
        updateCallback(updatedDocs);
      }
    );
  }

  private getDocumentReference(date: Date, uid: string): Query<DocumentData> {
    return this.buildQuery([
      where('date', '==', moment(date).startOf('day').toDate()),
      where('uid', '==', uid),
      where('deleted', '==', false),
      limit(1),
    ]);
  }

  public async findByWeek(
    beginningOfWeek: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const ref = this.getByWeekRef(beginningOfWeek, uid);
    const response = await this.query(ref);
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  private getByWeekRef(
    beginningOfWeek: Date,
    uid: string
  ): Query<DocumentData> {
    const start = moment(beginningOfWeek).startOf('isoWeek');
    const end = start.clone().endOf('isoWeek');
    return this.buildQuery([
      where('date', '>=', start.toDate()),
      where('date', '<', end.toDate()),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  public async findByMonth(
    beginningOfMonth: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]> {
    const ref = this.getByMonthRef(beginningOfMonth, uid);
    const response = await this.query(ref);
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments);
    }
    return [];
  }

  private getByMonthRef(
    beginningOfWeek: Date,
    uid: string
  ): Query<DocumentData> {
    const start = moment(beginningOfWeek).startOf('month');
    const end = start.clone().endOf('month');
    return this.buildQuery([
      where('date', '>=', start.toDate()),
      where('date', '<', end.toDate()),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  private mapDocuments(
    document: QueryDocumentSnapshot<DocumentData>
  ): DayDocument {
    const data = document.data();
    return {
      id: document.id,
      goalCalories: data.goalCalories,
      date: data.date.toDate(),
      weight: data.weight,
      water: data.water,
    };
  }
}
