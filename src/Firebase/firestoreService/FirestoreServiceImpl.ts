import firebase from 'firebase';
import FirestoreService from './FirestoreService';

export default class FirestoreServiceImpl implements FirestoreService {
  firestore: firebase.firestore.Firestore;

  constructor(
    firestore: firebase.firestore.Firestore
  ) {
    this.firestore = firestore;
  }

  createMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('meals').doc(uid+'-'+createdAt.getTime()+'-'+mealName).set({
      meal,
      eatenAt,
      createdAt,
      deleted: false,
      uid,
      mealName,
    });
  }

  updateMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date, id: string): Promise<void> {
    const updatedAt = new Date();
    return this.firestore.collection('meals').doc(id).update({
      meal,
      eatenAt,
      deleted: false,
      uid,
      mealName,
      updatedAt,
    });
  }

  async findMealsByDate(dateStart: Date, uid: string): Promise<any> {
    const dateEnd = new Date(dateStart.getTime());
    dateEnd.setDate(dateStart.getDate() + 1);
    const response = await this.firestore
                      .collection('meals')
                      .where('eatenAt', '>=', dateStart)
                      .where('eatenAt', "<", dateEnd)
                      .where('uid', '==', uid)
                      .where('deleted', '==', false)
                      .limit(1)
                      .get();
    if (response.docs.length){
      const mealDoc = response.docs[0].data();
      const id = response.docs[0].id;
      const { eatenAt, meal, mealName } = mealDoc
      return {
        id,
        eatenAt: eatenAt.toDate(),
        meal,
        mealName,
      }
    } return null
  }

  saveUser(user: {uid: string, email: string}): Promise<void> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  };
}
