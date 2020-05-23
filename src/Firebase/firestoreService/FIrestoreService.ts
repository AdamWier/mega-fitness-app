export default interface FirestoreService {
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
}
