import moment from 'moment';

export default class ShoppingListDocumentServiceImpl {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  async createShoppingList(
    beginningOfWeek: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<string | null> {
    const beginngingOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginngingOfWeekMoment.toDate();
    const createdAt = new Date();
    const id = `${uid} - ${beginngingOfWeekMoment.format(
      'YYYY-MM-DD'
    )} - ${createdAt.getTime()}`;
    try {
      await this.firestore.collection('shoppingList').doc(id).set({
        beginningOfWeekDate,
        list,
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
    uid: string,
    id: string
  ): Promise<void> {
    const beginngingOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginngingOfWeekMoment.toDate();
    const modifiedAt = new Date();
    return this.firestore.collection('shoppingList').doc(id).update({
      beginningOfWeekDate,
      list,
      uid,
      modifiedAt,
      deleted: false,
    });
  }
}
