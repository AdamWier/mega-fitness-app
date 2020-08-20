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
        beginningOfWeek: beginningOfWeekDate,
        list: list.items,
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

  async findDocument(beginningOfWeek: Date, uid: string): Promise<any> {
    const beginngingOfWeekMoment = moment(beginningOfWeek).startOf('isoWeek');
    const beginningOfWeekDate = beginngingOfWeekMoment.toDate();
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
      items: data.list,
    };
  }
}
