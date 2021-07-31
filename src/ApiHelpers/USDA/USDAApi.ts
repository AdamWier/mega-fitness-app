import { USDA_KEY } from 'react-native-dotenv';
import {
  USDASearchApiResult,
  USDAFoodDetailsResult,
  NutrientName,
  USDAFoodSearchResult,
} from './USDAApiTypes';
import { FoodResult, FoodDetails, FormattedPortion } from '../CommonAPITypes';

export default class USDAApi {
  private searchURI: string;

  private detailsURI: string;

  constructor() {
    this.searchURI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&includeDataTypeList=SR%20Legacy&sortField=score&requireAllWords=true`;
    this.detailsURI = `https://api.nal.usda.gov/fdc/v1/#FOOD_CODE#?api_key=${USDA_KEY}`;
  }

  public async search(
    searchText: string,
    currentPage?: number
  ): Promise<FoodResult[]> {
    const page = currentPage ? (currentPage + 1).toString() : '0';
    const result: USDASearchApiResult = await (
      await fetch(
        this.searchURI.concat(
          `&generalSearchInput=${searchText}&pageNumber=${page}`
        )
      )
    ).json();
    const sortedFoods = result.foods.sort(this.sortFoods);
    return sortedFoods.map((food) => {
      return {
        description: food.description,
        id: food.fdcId.toString(),
        api: 'USDA',
      };
    });
  }

  public async getDetails(foodId: string): Promise<FoodDetails> {
    const food: USDAFoodDetailsResult = await (
      await fetch(this.detailsURI.replace('#FOOD_CODE#', foodId))
    ).json();
    const name = food.description;
    const calories = this.getNutrient(food, NutrientName.Energy);
    const protein = this.getNutrient(food, NutrientName.Protein);
    const fats = this.getNutrient(food, NutrientName.Fat);
    const carbs = this.getNutrient(food, NutrientName.Carbs);
    const portions = this.getPortions(food);
    return {
      name,
      calories,
      protein,
      fats,
      carbs,
      portions,
    };
  }

  private getNutrient(
    food: USDAFoodDetailsResult,
    nutrient: NutrientName
  ): number {
    return (
      (food.foodNutrients?.find(
        (foodNutrient) => foodNutrient.nutrient.name === nutrient
      )?.amount || 0) / 100
    );
  }

  private sortFoods(a: USDAFoodSearchResult, b: USDAFoodSearchResult): number {
    if (a.scientificName && !b.scientificName) {
      return -1;
    }
    if (!a.scientificName && b.scientificName) {
      return 1;
    }
    if (b.score - a.score === 0) {
      return (
        parseInt(a.ndbNumber || '0', 10) - parseInt(b.ndbNumber || '0', 10)
      );
    }
    return b.score - a.score;
  }

  private getPortions(food: USDAFoodDetailsResult): FormattedPortion[] {
    return [
      ...(food.foodPortions || []).map((portion) => ({
        weight: portion.gramWeight,
        description: portion.modifier,
      })),
      {
        weight: 1,
        description: 'gram',
      },
    ];
  }
}
