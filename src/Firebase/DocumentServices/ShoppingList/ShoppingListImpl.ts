import moment from 'moment';
import ShoppingList from './ShoppingList';

export default class ShoppingListDocumentServiceImpl implements ShoppingList {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  async createShoppingList(
    beginningOfWeek: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<string | null> {
    const beginningOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginningOfWeekMoment.toDate();
    const createdAt = new Date();
    const id = `${uid} - ${beginningOfWeekMoment.format(
      'YYYY-MM-DD'
    )} - ${createdAt.getTime()}`;
    const { items } = list;

    try {
      await this.firestore.collection('shoppingList').doc(id).set({
        beginningOfWeek: beginningOfWeekDate,
        items,
        uid,
        createdAt,
        deleted: false,
      });
      return id;
    } catch (e) {
      return null;
    }
  }

  updateShoppingList(
    beginningOfWeek: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<void> {
    const beginningOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginningOfWeekMoment.toDate();
    const modifiedAt = new Date();
    const { id, items } = list;

    return this.firestore.collection('shoppingList').doc(id).update({
      beginningOfWeekDate,
      items,
      uid,
      modifiedAt,
      deleted: false,
    });
  }

  async findDocument(
    beginningOfWeek: Date,
    uid: string
  ): Promise<{ id: string; items: { [key: string]: any } }> {
    const beginningOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginningOfWeekMoment.toDate();
    const response = await this.getDocumentReference(
      beginningOfWeekDate,
      uid
    ).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments)[0];
    }
    return null;
  }

  getDocumentReference(
    date: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    return this.firestore
      .collection('shoppingList')
      .where('beginningOfWeek', '==', moment(date).startOf('day').toDate())
      .where('uid', '==', uid)
      .where('deleted', '==', false)
      .limit(1);
  }

  mapDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >
  ): any {
    const data = document.data();
    return {
      id: document.id,
      items: data.items,
    };
  }
}
