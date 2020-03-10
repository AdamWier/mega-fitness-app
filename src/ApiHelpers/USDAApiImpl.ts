import { USDA_KEY } from 'react-native-dotenv';
import { USDAApiResult } from './USDAApi';

export default class USDAApiHelper{
    URI: string;

    constructor(){
        this.URI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&includeDataTypeList=SR%20Legacy,Survey%20(FNDDS),Foundation&sortField=score`
    }

    async search(searchText: string): Promise<any>{
        const json: USDAApiResult  = await (await fetch(this.URI.concat(`&generalSearchInput=${searchText}`))).json();
        // Sort to be improved
        const filteredFoods = json.foods.sort(food => food.dataType === "Survey (FNDDS)" ? -1 : 1);
        console.log(filteredFoods)
        return filteredFoods.map(food => food.description);
    }
}