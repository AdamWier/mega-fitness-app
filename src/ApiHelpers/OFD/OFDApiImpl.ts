import { FoodResult, FoodDetails } from '../CommonAPITypes';
import {
  Helper,
  OFDSearchResult,
  OFDDetailsResult,
  OFDFood,
  NutrientName,
} from './OFDApi';

export default class OFDAImpl implements Helper {
  getSearchURI(locale: string, searchText: string, page: string): string {
    const returnedFields = [
      'brands',
      'product_name',
      'product_name_en',
      'product_name_fr',
      'completeness',
      '_id',
    ];
    const addressComponents = {
      baseURI: `https://${locale}.openfoodfacts.org/cgi/search.pl?json=true&search_simple=1&action=process&page_size=50&search_terms=${searchText}&page=${page}`,
      stateTagFilter:
        '&tagtype_0=states&tag_contains_0=contains&tag_0=characteristics-completed',
      returnedFiledsFilter: `&fields=${returnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  getDetailsURI(id: string): string {
    const returnedFields = [
      'brands',
      'product_name',
      'product_name_en',
      'product_name_fr',
      '_id',
      'nutriments',
      'serving_size',
      'serving_quantity',
    ];
    const addressComponents = {
      baseURI: `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
      returnFieldsFilter: `&fields=${returnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  async search(searchText: string, isFranceLocale: boolean, currentPage?: number): Promise<FoodResult[]> {
    const page = currentPage ? (currentPage+1).toString() : '0';
    const headers = new Headers({
      'User-Agent': 'mega-fitness-app-dev - Android - Version 0.0',
    });
    const results: OFDSearchResult = await (
      await fetch(
        this.getSearchURI(isFranceLocale ? 'fr' : 'us', searchText, page),
        {
          headers,
        }
      )
    ).json();
    const filteredResults = results.products.filter(
      (product) => Number(product.completeness) > 0.5
    );
    return filteredResults.map((food) => {
      const productName =
        food.product_name || food.product_name_en || food.product_name_fr;
      const description = food.brands
        ? `${productName} (${food.brands})`
        : productName;
      return {
        description,
        id: food._id,
        api: 'Open Food Data',
      };
    });
  }

  async getDetails(foodId: string): Promise<FoodDetails> {
    const result: OFDDetailsResult = await (
      await fetch(this.getDetailsURI(foodId))
    ).json();
    const { product } = result;
    const name =
      product.product_name ||
      product.product_name_en ||
      product.product_name_fr;
    const calories =
      this.getNutrient(product, NutrientName.Energy) ||
      this.convertKjToCalories(this.getNutrient(product, NutrientName.Kj));
    const protein = this.getNutrient(product, NutrientName.Protein);
    const fats = this.getNutrient(product, NutrientName.Fat);
    const carbs = this.getNutrient(product, NutrientName.Carbs);
    const portions = this.getPortions(product);
    console.log({ name, calories, protein, fats, carbs, portions });
    if (
      name &&
      !Number.isNaN(calories) &&
      !Number.isNaN(protein) &&
      !Number.isNaN(fats) &&
      !Number.isNaN(carbs) &&
      portions
    ) {
      return {
        name,
        calories,
        protein,
        fats,
        carbs,
        portions,
      };
    }
    return null;
  }

  getNutrient(food: OFDFood, nutrient: NutrientName): number {
    return food.nutriments[`${nutrient}`] / 100;
  }

  getPortions(product: OFDFood) {
    const portions = [
      {
        weight: 1,
        description: 'gram',
      },
    ];
    if (product.serving_quantity) {
      portions.push({
        weight: Number(product.serving_quantity),
        description: `Portion (${product.serving_size})`,
      });
    }
    return portions;
  }

  convertKjToCalories(kj: number): number {
    return kj / 4.184;
  }
}
