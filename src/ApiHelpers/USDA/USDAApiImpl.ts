import { USDA_KEY } from 'react-native-dotenv';
import { USDASearchApiResult, USDAFood, Helper, USDAFoodDetails, USDAFoodDetailsResult, NutrientName, USDAFoodSearchResult } from './USDAApi';
import { APITypes } from '../APITypes';

export default class USDAApiImpl implements Helper{
    searchURI: string;

    detailsURI: string;

    constructor(){
        this.searchURI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&includeDataTypeList=SR%20Legacy&sortField=score&requireAllWords=true`;
        this.detailsURI = `https://api.nal.usda.gov/fdc/v1/#FOOD_CODE#?api_key=${USDA_KEY}`;
    }

    async search(searchText: string): Promise<USDAFood[]>{
        const result: USDASearchApiResult  = await (await fetch(this.searchURI.concat(`&generalSearchInput=${searchText}`))).json();
        const sortedFoods = result.foods.sort(this.sortFoods);
        return sortedFoods.map(food => {
            const {description, fdcId} = food;
            return {
                description,
                fdcId,
                api: APITypes.USDA
            }
        });
    }

    async getDetails(foodId: number): Promise<USDAFoodDetails> {
        const food: USDAFoodDetailsResult = await (await fetch(this.detailsURI.replace('#FOOD_CODE#', foodId.toString()))).json();
        const name = food.description
        const calories = this.getNutrient(food, NutrientName.Energy);
        const protein = this.getNutrient(food, NutrientName.Protein);
        const fats =  this.getNutrient(food, NutrientName.Fat);
        const carbs = this.getNutrient(food, NutrientName.Carbs);
        return {
            name,
            calories,
            protein,
            fats,
            carbs, 
        }
    }

    getNutrient(food: USDAFoodDetailsResult, nutrient: NutrientName): number {
        return food.foodNutrients.find(
            foodNutrient => foodNutrient.nutrient.name === nutrient
        ).amount;
    }

    sortFoods(a: USDAFoodSearchResult, b: USDAFoodSearchResult): number {
        if (a.scientificName && !b.scientificName) return -1;
        if (!a.scientificName && b.scientificName) return 1;
        if(b.score - a.score === 0) return parseInt(a.ndbNumber, 10) - parseInt(b.ndbNumber, 10);
        return b.score - a.score;
    }
}