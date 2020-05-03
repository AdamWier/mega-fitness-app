export interface FoodResult {
  description: string;
  id: string;
  api: 'USDA' | 'Open Food Data';
}

export interface FoodDetails {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  portions: FormattedPortion[];
}

export interface FormattedPortion {
  description: string;
  weight: number;
}
