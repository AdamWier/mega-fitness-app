import firebase from 'firebase';
import FirestoreService from './FirestoreService';

export default class FirestoreServiceImpl implements FirestoreService {
  firestore: firebase.firestore.Firestore;

  constructor(
    firestore: firebase.firestore.Firestore
  ) {
    this.firestore = firestore;
  }

  saveMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date, totalCalories: number): Promise<void> {
    const createdAt = new Date();
    return this.firestore.collection('meals').doc(uid+'-'+createdAt.getTime()+'-'+mealName).set({
      meal,
      eatenAt,
      createdAt,
      deleted: false,
      uid,
      totalCalories,
      mealName
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
      const { eatenAt, meal, mealName } = mealDoc
      return {
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
