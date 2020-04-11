export default interface FirestoreService {
    saveMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date, calories: number): Promise<void>;
    saveUser(user: {uid: string, email: string}): Promise<void>;
}