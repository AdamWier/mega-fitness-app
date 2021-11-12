import { FoodResult, FoodDetails, FormattedPortion } from '../CommonAPITypes';
import {
  OFDSearchResult,
  OFDDetailsResult,
  OFDFood,
  NutrientName,
} from './OFDApiTypes';

export default class OFDApi {
  searchReturnedFields: string[];
  detailsReturnedFields: string[];

  constructor() {
    this.searchReturnedFields = [
      'brands',
      'product_name',
      'product_name_en',
      'product_name_fr',
      'completeness',
      '_id',
    ];
    this.detailsReturnedFields = [
      'brands',
      'product_name',
      'product_name_en',
      'product_name_fr',
      '_id',
      'nutriments',
      'serving_size',
      'serving_quantity',
    ];
  }

  private getSearchURI(
    locale: string,
    searchText: string,
    page: string
  ): string {
    const addressComponents = {
      baseURI: `https://${locale}.openfoodfacts.org/cgi/search.pl?json=true&search_simple=1&action=process&page_size=50&search_terms=${searchText}&page=${page}`,
      stateTagFilter:
        '&tagtype_0=states&tag_contains_0=contains&tag_0=en:characteristics-completed',
      returnedFieldsFilter: `&fields=${this.searchReturnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  private getBarcodeSearchURI(barcode: string): string {
    const addressComponents = {
      baseURI: `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      returnFieldsFilter: `&fields=${this.detailsReturnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  private getDetailsURI(id: string): string {
    const addressComponents = {
      baseURI: `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
      returnFieldsFilter: `&fields=${this.detailsReturnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  public async search(
    searchText: string,
    isFranceLocale: boolean,
    currentPage?: number
  ): Promise<FoodResult[]> {
    const page = currentPage ? (currentPage + 1).toString() : '0';
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

  public async barcodeSearch(barcode: string) {
    const result = await (
      await fetch(this.getBarcodeSearchURI(barcode))
    ).json();
    return result.product ? this.adaptResult(result.product) : null;
  }

  public async getDetails(foodId: string) {
    const result: OFDDetailsResult = await (
      await fetch(this.getDetailsURI(foodId))
    ).json();
    return result.product ? this.adaptResult(result.product) : null;
  }

  private adaptResult(product: OFDFood): FoodDetails | undefined {
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
    if (
      product.nutriments.hasOwnProperty('alcohol') &&
      !Number.isNaN(calories)
    ) {
      return {
        name,
        calories,
        protein: 0,
        fats: 0,
        carbs: calories / 4,
        portions,
      };
    }
    return;
  }

  private getNutrient(food: OFDFood, nutrient: NutrientName) {
    return Number(food.nutriments[nutrient]) / 100;
  }

  private getPortions(product: OFDFood): FormattedPortion[] {
    const portions = [
      {
        weight: 1,
        description: 'gram',
      },
    ];
    if (Number(product.serving_quantity)) {
      portions.push({
        weight: Number(product.serving_quantity),
        description: `Portion (${product.serving_size})`,
      });
    }
    return portions;
  }

  private convertKjToCalories(kj: number): number {
    return kj / 4.184;
  }
}
