import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  query,
  Query,
  QueryConstraint,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export default class DocumentService {
  private collection: CollectionReference<DocumentData>;

  constructor(firestore: Firestore, collectionName: string) {
    this.collection = collection(firestore, collectionName);
  }

  protected getDoc = (id: string) => doc(this.collection, id);
  protected updateDoc = (id: string, document: Record<string, any>) =>
    updateDoc(this.getDoc(id), document);
  protected setDoc = (id: string, document: Record<string, any>) =>
    setDoc(this.getDoc(id), document);
  protected buildQuery = (queryParts: QueryConstraint[]) =>
    query(this.collection, ...queryParts);
  protected query = (query: Query<DocumentData>) => getDocs(query);
}
