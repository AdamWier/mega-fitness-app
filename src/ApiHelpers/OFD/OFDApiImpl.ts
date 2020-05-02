import { FoodResult } from '../CommonAPITypes';
import { Helper, OFDSearchResult } from './OFDApi';

export default class OFDAImpl implements Helper {
  getSearchURI(locale: string): string {
    const returnedFields = [
      'brands',
      'product_name',
      'product_name_en',
      'product_name_fr',
      'completeness',
      '_id',
    ];
    const addressComponents = {
      baseURI: `https://${locale}.openfoodfacts.org/cgi/search.pl?json=true&search_simple=1&action=process`,
      stateTagFilter:
        '&tagtype_0=states&tag_contains_0=contains&tag_0=nutrition-facts-completed',
      returnedFiledsFilter: `&fields=${returnedFields.join(',')}`,
    };
    return Object.values(addressComponents).join('');
  }

  async search(searchText: string): Promise<FoodResult[]> {
    const headers = new Headers({
      'User-Agent': 'mega-fitness-app-dev - Android - Version 0.0',
    });
    const results: OFDSearchResult = await (
      await fetch(
        this.getSearchURI('us').concat(`&search_terms=${searchText}`),
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
}
