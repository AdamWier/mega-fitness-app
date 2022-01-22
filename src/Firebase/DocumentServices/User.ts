import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  limit,
  onSnapshot,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { UserDocument } from '../Documents/UserDocument';
import DocumentService from './DocumentService';

export default class UserService extends DocumentService {
  constructor(firestore: Firestore) {
    super(firestore, 'users');
  }

  public create({ uid, email }: { uid: string; email: string }): Promise<void> {
    const createdAt = new Date();
    return this.setDoc(uid, {
      uid,
      email,
      createdAt,
    });
  }

  public async getDocument(uid: string) {
    const ref = this.buildQuery([where('uid', '==', uid), limit(1)]);
    const docs = await this.handleReponse(ref);
    return docs.pop() || null;
  }

  protected mapDocuments(
    document: QueryDocumentSnapshot<DocumentData>
  ): UserDocument {
    const data = document.data();
    return {
      email: data.email,
      goalCalories: data.goalCalories,
      uid: data.uid,
      waterGoal: data.waterGoal,
    };
  }

  public updateCalorieGoal(uid: string, goalCalories: number): Promise<void> {
    const updatedAt = new Date();
    return this.updateDoc(uid, {
      goalCalories,
      updatedAt,
    });
  }

  public updateWaterGoal(uid: string, waterGoal: number): Promise<void> {
    const updatedAt = new Date();
    return this.updateDoc(uid, {
      waterGoal,
      updatedAt,
    });
  }

  public getDocumentListener(uid: string, updateCallback: Function): Function {
    return onSnapshot(
      this.getDoc(uid),
      (snapshot: DocumentSnapshot<DocumentData>) => {
        updateCallback(snapshot.data());
      }
    );
  }
}
