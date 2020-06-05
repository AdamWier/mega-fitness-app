export default interface Day {
  createGoal(date: Date, goalCalories: number, uid: string): Promise<void>;
  updateGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string,
    id: string
  ): Promise<void>;
  findDocument(date: Date, uid: string): Promise<{ [key: string]: any }>;
  getDocumentListener(
    date: Date,
    uid: string,
    updateCallback: Function
  ): Function;
  getDocumentReference(
    date: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData>;
  mapDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >
  ): { [key: string]: any };
}
