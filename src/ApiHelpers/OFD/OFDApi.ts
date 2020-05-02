import { FoodResult } from '../CommonAPITypes';

export interface Helper {
  getSearchURI(locale: string): string;
  search(searchText: string): Promise<FoodResult[]>;
}

export interface OFDSearchResult {
  page: number;
  page_size: number;
  products: {
    _id: string;
    product_name: string;
    product_name_en: string;
    product_name_fr: string;
    brands: string;
    completeness: string;
  }[];
  count: number;
  skip: number;
}
