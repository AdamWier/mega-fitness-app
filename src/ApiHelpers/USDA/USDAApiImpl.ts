import { USDA_KEY } from 'react-native-dotenv';
import { USDAApiResult, USDASearchResult } from './USDAApi';
import { APITypes } from '../APITypes';

export default class USDAApiImpl{
    URI: string;

    constructor(){
        this.URI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&includeDataTypeList=SR%20Legacy,Survey%20(FNDDS),Foundation&sortField=score`
    }

    async search(searchText: string): Promise<USDASearchResult[]>{
        const json: USDAApiResult  = await (await fetch(this.URI.concat(`&generalSearchInput=${searchText}`))).json();
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
}