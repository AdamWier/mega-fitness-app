import {
  DocumentData,
  Firestore,
  limit,
  Query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import ShoppingListDocument from '../Documents/ShoppingListDocument';
import DocumentService from './DocumentService';

export default class ShoppingListService extends DocumentService {
  constructor(firestore: Firestore) {
    super(firestore, 'shoppingList');
  }

  public async createShoppingList(
    start: Date,
    end: Date,
    list: { [key: string]: any },
    uid: string
  ) {
    const createdAt = new Date();
    const id = `${uid} - ${moment(start).format(
      'YYYY-MM-DD'
    )} - ${createdAt.getTime()}`;
    const { items } = list;

    try {
      await this.setDoc(id, {
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

    return this.updateDoc(id, {
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
  ): Promise<ShoppingListDocument | null> {
    const ref = this.getDocumentReference(start, end, uid);
    const docs = await this.handleReponse(ref);
    return (docs.pop() as unknown as ShoppingListDocument | undefined) || null;
  }

  private getDocumentReference(
    start: Date,
    end: Date,
    uid: string
  ): Query<DocumentData> {
    return this.buildQuery([
      where('start', '==', start),
      where('end', '==', end),
      where('uid', '==', uid),
      where('deleted', '==', false),
      limit(1),
    ]);
  }

  protected mapDocuments(
    document: QueryDocumentSnapshot<DocumentData>
  ): ShoppingListDocument {
    const data = document.data();
    return {
      id: document.id,
      items: data.items,
    };
  }
}
