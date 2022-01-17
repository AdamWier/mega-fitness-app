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
  QueryDocumentSnapshot,
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
  private executeQuery = (queryToExcute: Query<DocumentData>) =>
    getDocs(queryToExcute);

  protected handleReponse = async (
    ref: Query<DocumentData>,
    mapper: (
      document: QueryDocumentSnapshot<DocumentData>
    ) => Record<string, any>
  ) => {
    const response = await this.executeQuery(ref);
    if (response.docs.length) {
      return response.docs.map(mapper);
    }
    return [];
  };
}
