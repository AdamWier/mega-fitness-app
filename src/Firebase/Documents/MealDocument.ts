export default interface MealDocument {
  meal: Array<AddedFood>;
  eatenAt: Date;
  createdAt: Date;
  deleted: boolean;
  uid: string;
  name: string;
  updatedAt?: string;
  id?: string;
}

interface AddedFood {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  amount: number;
  name: string;
  portionDiscription: string;
}
