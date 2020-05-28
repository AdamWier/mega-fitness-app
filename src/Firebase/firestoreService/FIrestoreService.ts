export interface FirestoreService {
  createMeal(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date
  ): Promise<void>;
  updateMeal(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date,
    id: string
  ): Promise<void>;
  deleteMeal(id: string): Promise<void>;
  findMealsByDate(
    dateStart: Date,
    uid: string
  ): Promise<{ [key: string]: any }[]>;
  getFindMealsByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ): Function;
  getMealsByDateRef(
    currentDate: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData>;
  saveUser(user: { uid: string; email: string }): Promise<void>;
  createDayGoal(date: Date, goalCalories: number, uid: string): Promise<void>;
  updateDayGoal(
    currentDate: Date,
    goalCalories: number,
    uid: string,
    id: string
  ): Promise<void>;
  findDayDocument(date: Date, uid: string): Promise<{ [key: string]: any }>;
  getDayDocumentListener(
    date: Date,
    uid: string,
    updateCallback: Function
  ): Function;
  getDayDocumentReference(
    date: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData>;
  mapDayDocuments(
    document: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >
  ): { [key: string]: any };
}

export interface DayDocument {
  id: string;
  goalCalories: number;
}
