export default class UserService {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  public create({ uid, email }: { uid: string; email: string }): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('users').doc(uid).set({
      uid,
      email,
      createdAt,
    });
  }

  public async getDocument(
    uid: string
  ): Promise<firebase.firestore.DocumentData> {
    const response = await this.firestore
      .collection('users')
      .where('uid', '==', uid)
      .limit(1)
      .get();
    return response.docs.length === 1 ? response.docs[0].data() : null;
  }

  public updateCalorieGoal(uid: string, goalCalories: number): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('users').doc(uid).update({
      goalCalories,
      updatedAt,
    });
  }

  public getDocumentListener(uid: string, updateCallback: Function): Function {
    return this.firestore
      .collection('users')
      .doc(uid)
      .onSnapshot((snapshot) => {
        updateCallback(snapshot.data());
      });
  }
}
