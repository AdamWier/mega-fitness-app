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

export interface OFDDetailsResult {
  product: OFDFood;
  status_verbose: string;
  code: string;
  status: number;
}

export interface OFDFood {
  _id: string;
  product_name: string;
  product_name_en: string;
  product_name_fr: string;
  brands: string;
  serving_quantity: string;
  serving_size: string;
  nutriments: {
    fat_unit?: string;
    sugars_unit?: string;
    carbohydrates_unit?: string;
    fat?: number;
    ['energy-kcal_serving']?: number;
    sodium_value?: number;
    energy_value?: number;
    sodium_unit?: string;
    ['energy-kcal_unit']?: string;
    fat_100g?: number;
    carbohydrates_100g?: number;
    ['nova-group']?: number;
    sugars_serving?: number;
    salt_serving?: number;
    carbohydrates_serving?: number;
    sodium_serving?: number;
    proteins_unit?: string;
    salt_value?: number;
    sugars_100g?: number;
    salt?: number;
    carbohydrates?: number;
    energy_unit?: string;
    ['nutrition-score-fr_100g']?: number;
    energy?: number;
    ['nova-group_100g']?: number;
    ['saturated-fat_100g']?: number;
    ['saturated-fat_value']?: number;
    sodium?: number;
    ['fruits-vegetables-nuts-estimate-from-ingredients_100g']?: number;
    energy_serving?: number;
    ['energy-kcal']?: number;
    fat_value?: number;
    sodium_100g?: number;
    salt_unit?: string;
    proteins_serving?: number;
    energy_100g?: number;
    ['nova-group_serving']?: number;
    salt_100g?: number;
    proteins_value?: number;
    ['energy-kcal_100g']?: number;
    carbohydrates_value?: number;
    ['nutrition-score-fr']?: number;
    ['saturated-fat_unit']?: string;
    proteins?: number;
    proteins_100g?: number;
    ['saturated-fat_serving']?: number;
    fat_serving?: number;
    sugars_value?: number;
    ['saturated-fat']?: number;
    ['energy-kcal_value']?: number;
    ['energy-kj_value']?: number;
    sugars?: number;
    alcohol?: number;
    alcohol_100g?: number;
    alcohol_serving?: number;
    alcohol_unit?: string;
    alcohol_value?: number;
  };
}

export enum NutrientName {
  Protein = 'proteins_100g',
  Fat = 'fat_100g',
  Carbs = 'carbohydrates_100g',
  Energy = 'energy-kcal_value',
  Kj = 'energy-kj_value',
}
