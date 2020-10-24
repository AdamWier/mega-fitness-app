import moment from 'moment';

export default class ShoppingListService {
  firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore;
  }

  public async createShoppingList(
    start: Date,
    end: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<string | null> {
    const createdAt = new Date();
    const id = `${uid} - ${moment(start).format(
      'YYYY-MM-DD'
    )} - ${createdAt.getTime()}`;
    const { items } = list;

    try {
      await this.firestore.collection('shoppingList').doc(id).set({
        start,
        end,
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

  public updateShoppingList(
    list: { [key: string]: any },
    uid: string
  ): Promise<void> {
    const modifiedAt = new Date();
    const { id, items } = list;

    return this.firestore.collection('shoppingList').doc(id).update({
      items,
      uid,
      modifiedAt,
      deleted: false,
    });
  }

  public async findDocument(
    start: Date,
    end: Date,
    uid: string
  ): Promise<{ id: string; items: { [key: string]: any } }> {
    const response = await this.getDocumentReference(start, end, uid).get();
    if (response.docs.length) {
      return response.docs.map(this.mapDocuments)[0];
    }
    return null;
  }

  getDocumentReference(
    start: Date,
    end: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData> {
    return this.firestore
      .collection('shoppingList')
      .where('start', '==', start)
      .where('end', '==', end)
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
