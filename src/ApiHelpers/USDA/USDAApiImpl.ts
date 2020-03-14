import { USDA_KEY } from 'react-native-dotenv';
import { USDASearchApiResult, USDAFood, Helper, USDAFoodDetails, USDAFoodDetailsResult, NutrientName } from './USDAApi';
import { APITypes } from '../APITypes';

export default class USDAApiImpl implements Helper{
    searchURI: string;

    detailsURI: string;

    constructor(){
        this.searchURI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&includeDataTypeList=SR%20Legacy,Survey%20(FNDDS),Foundation&sortField=score`;
        this.detailsURI = `https://api.nal.usda.gov/fdc/v1/#FOOD_CODE#?api_key=${USDA_KEY}`;
    }

    async search(searchText: string): Promise<USDAFood[]>{
        const json: USDASearchApiResult  = await (await fetch(this.searchURI.concat(`&generalSearchInput=${searchText}`))).json();
        const sortedFoods = json.foods.sort((a,b) => b.score - a.score).sort(food => food.scientificName ? -1 : 0);
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
        const json: USDAFoodDetailsResult = await (await fetch(this.detailsURI.replace('#FOOD_CODE#', foodId.toString()))).json();
        const foodNutrients = json.foodNutrients;
        const name = json.description
        const calories = foodNutrients.find(foodNutrient => foodNutrient.nutrient.name === NutrientName.Energy).amount;
        const protein = foodNutrients.find(foodNutrient => foodNutrient.nutrient.name === NutrientName.Protein).amount;
        const fats = foodNutrients.find(foodNutrient => foodNutrient.nutrient.name === NutrientName.Fat).amount;
        const carbs = foodNutrients.find(foodNutrient => foodNutrient.nutrient.name === NutrientName.Carbs).amount;
        return {
            name,
            calories,
            protein,
            fats,
            carbs, 
        }
    }
}