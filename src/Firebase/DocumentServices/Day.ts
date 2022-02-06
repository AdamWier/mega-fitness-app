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
    return this.createDayDoc(currentDate, uid, 'goalCalories', goalCalories);
  }

  public updateGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string,
    id: string
  ): Promise<void> {
    return this.updateDayDoc(
      id,
      'goalCalories',
      goalCalories,
      uid,
      currentDate
    );
  }

  public createWeight(
    currentDate: Date,
    weight: number,
    uid: string
  ): Promise<void> {
    return this.createDayDoc(currentDate, uid, 'weight', weight);
  }

  public updateWeight(
    currentDate: Date,
    weight: number,
    uid: string,
    id: string
  ): Promise<void> {
    return this.updateDayDoc(id, 'weight', weight, uid, currentDate);
  }

  public createWater(
    currentDate: Date,
    water: number,
    uid: string
  ): Promise<void> {
    return this.createDayDoc(currentDate, uid, 'water', water);
  }

  public updateWater(
    currentDate: Date,
    water: number,
    uid: string,
    id: string
  ): Promise<void> {
    return this.updateDayDoc(id, 'water', water, uid, currentDate);
  }

  public async findDocument(date: Date, uid: string) {
    const ref = this.getDocumentReference(date, uid);
    const documents = await this.handleReponse(ref);
    return (documents.pop() || {}) as DayDocument;
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
    const endOfWeek = moment(beginningOfWeek).clone().endOf('isoWeek').toDate();
    const ref = this.getByPeriodRef(uid, beginningOfWeek, endOfWeek);
    return this.handleReponse(ref);
  }

  private getByPeriodRef(
    uid: string,
    beginning: Date,
    end: Date
  ): Query<DocumentData> {
    return this.buildQuery([
      where('date', '>=', beginning),
      where('date', '<', end),
      where('uid', '==', uid),
      where('deleted', '==', false),
    ]);
  }

  public async findLastThiryDays(date: Date, uid: string) {
    const start = moment(date).clone().subtract(30, 'days').toDate();
    const ref = this.getByPeriodRef(uid, start, date);
    return this.handleReponse(ref);
  }

  protected mapDocuments(
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

  private createDayDoc(
    currentDate: Date,
    uid: string,
    propertyToUpdate: keyof DayDocument,
    newValue: any
  ) {
    const dayStartMoment = moment(currentDate).startOf('day');
    const date = dayStartMoment.toDate();
    const createdAt = new Date();
    const id = `${uid}-${dayStartMoment.format(
      'YYYY-MM-DD'
    )}-${createdAt.getTime()}`;

    return this.setDoc(id, {
      date,
      [propertyToUpdate]: newValue,
      uid,
      createdAt,
      deleted: false,
    });
  }

  private updateDayDoc(
    id: string,
    propertyToUpdate: keyof DayDocument,
    newValue: any,
    uid: string,
    currentDate: Date
  ) {
    const date = moment(currentDate).startOf('day').toDate();
    const updatedAt = new Date();
    return this.updateDoc(id, {
      date,
      [propertyToUpdate]: newValue,
      uid,
      updatedAt,
      deleted: false,
    });
  }
}
