export default interface Meal {
  create(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date
  ): Promise<void>;
  update(
    meal: Array<any>,
    name: string,
    uid: string,
    eatenAt: Date,
    id: string
  ): Promise<void>;
  delete(id: string): Promise<void>;
  findByDate(dateStart: Date, uid: string): Promise<{ [key: string]: any }[]>;
  getFindByDateListener(
    currentDate: Date,
    uid: string,
    updateCallback: Function
  ): Function;
  getByDateRef(
    currentDate: Date,
    uid: string
  ): firebase.firestore.Query<firebase.firestore.DocumentData>;
}
