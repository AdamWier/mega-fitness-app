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
    uid: string,
    updateCallback?: Function
  ): Promise<{ [key: string]: any }[]>;
  saveUser(user: { uid: string; email: string }): Promise<void>;
}
