import User from './User';

export default class UserImpl implements User {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  create({ uid, email }: { uid: string; email: string }): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('users').doc(uid).set({
      uid,
      email,
      createdAt,
    });
  }

  async getDocument(uid: string): Promise<firebase.firestore.DocumentData> {
    const response = await this.firestore
      .collection('users')
      .where('uid', '==', uid)
      .limit(1)
      .get();
    return response.docs.length === 1 ? response.docs[0].data() : null;
  }

  updateCalorieGoal(uid: string, goalCalories: number): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('users').doc(uid).update({
      goalCalories,
      updatedAt,
    });
  }
}
