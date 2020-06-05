export default interface User {
  create(user: { uid: string; email: string }): Promise<void>;
  getDocument(uid: string): Promise<firebase.firestore.DocumentData>;
  updateCalorieGoal(uid: string, goalCalories: number): Promise<void>;
}
