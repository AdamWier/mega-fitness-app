export default interface FirestoreService {
    createMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date): Promise<void>;
    updateMeal(meal: Array<any>, mealName: string, uid: string, eatenAt: Date, id: string): Promise<void>;
    saveUser(user: {uid: string, email: string}): Promise<void>;
}