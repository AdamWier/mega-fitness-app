import { FoodResult } from '../CommonAPITypes';

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

export interface USDAFoodDetailsResult {
  changes: string;
  dataType: string;
  description: string;
  endDate: string;
  fdcId: number;
  foodAttributes?: FoodAttribute[];
  foodComponents?: Array<FoodResult>;
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
  AdditionalDescription = 'Additional Description',
  CommonName = 'Common Name',
  Adjustments = 'Adjustments',
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
  microgram = 'µg',
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
