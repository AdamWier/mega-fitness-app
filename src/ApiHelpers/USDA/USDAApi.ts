import { APITypes } from '../APITypes';

export interface Helper {
  search(searchText: string): Promise<USDAFood[]>;
  getDetails(foodId: number): Promise<USDAFoodDetails>;
  getNutrient(food: USDAFoodDetailsResult, nutrient: NutrientName): number;
  sortFoods(a: USDAFoodSearchResult, b: USDAFoodSearchResult): number;
}

export interface USDASearchApiResult {
  foodSearchCriteria: string;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFoodSearchResult[];
}

export interface USDAFoodSearchResult {
  fdcId: number;
  description: string;
  scientificName?: string;
  commonNames?: string;
  additionalDescriptions?: string;
  dataType: string;
  foodCode?: string;
  gtinUpc?: string;
  ndbNumber?: string;
  publishedDate: string;
  brandOwner?: string;
  ingredients: string;
  allHighlightFields: string;
  score: number;
}

export interface USDAFood {
  description: string;
  fdcId: number;
  api: APITypes.USDA;
}

export interface USDAFoodDetailsResult {
  changes: string;
  dataType: string;
  description: string;
  endDate: string;
  fdcId: number;
  foodAttributes?: FoodAttribute[];
  // So far, always an empty array
  foodComponents?: Array<USDAFood>;
  foodNutrients?: Nutrient[];
  foodPortions?: FoodPortion[];
  inputFoods: InputFood[];
  publicationDate: string;
  startDate: string;
  wweiaFoodCategory: {
    wweiaFoodCategoryCode: number;
    wweiaFoodCategoryDescription: string;
  };
}

export interface USDAFoodDetails {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  portions: FormattedPortion[];
}

interface InputFood {
  foodDescription: string;
  id: number;
  inputFood: {
    dataType: string;
    description: string;
    fdcId: number;
    foodCategory: {
      code: string;
      description: string;
      id: number;
    };
    foodClass: string;
    publicationDate: string;
    tableAliasName: string;
  };
}

interface FoodAttribute {
  id: number;
  sequenceNumber: number;
  value: string;
  foodAttributeType: {
    description: string;
    id: number;
    name: FoodAttributeName;
  };
}

enum FoodAttributeName {
  AdditionalDescripion = 'Additional Description',
  CommonName = 'Common Name',
  Adjustments = 'Adjustements',
}

interface Nutrient {
  amount: number;
  id: number;
  nutrient: {
    id: number;
    name: NutrientName | string;
    number: string;
    rank: number;
    unitName: Unit;
  };
  type: NutrientType | string;
}

enum NutrientType {
  FoodNutrient = 'FoodNutrient',
}

enum Unit {
  g = 'g',
  kcal = 'kcal',
  mg = 'mg',
  micorgram = 'µg',
  kJ = 'kj',
  IU = 'IU',
  go = 'go',
}

export enum NutrientName {
  Protein = 'Protein',
  Fat = 'Total lipid (fat)',
  Carbs = 'Carbohydrate, by difference',
  Energy = 'Energy',
  Water = 'Water',
  Caffeine = 'Caffeine',
  Sugars = 'Sugars, total including NLEA',
  Fiber = 'Fiber, total dietary',
}

interface FoodPortion {
  gramWeight: number;
  id: number;
  measureUnit: {
    abbreviation: string;
    id: number;
    name: string;
  };
  modifier: string;
  portionDescription?: string;
  sequenceNumber: number;
}

export interface FormattedPortion {
  description: string;
  weight: number;
}
