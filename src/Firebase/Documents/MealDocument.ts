export default interface MealDocument {
  meal: Array<AddedFood>;
  eatenAt: Date;
  name: string;
  updatedAt?: string;
  id?: string;
}

export interface AddedFood {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  amount: number;
  name: string;
  portionDescription: string;
}
