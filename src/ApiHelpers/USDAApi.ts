import { USDA_KEY } from 'react-native-dotenv';

export default class USDAApiHelper{
    URI: string;

    constructor(){
        this.URI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}`
    }

    async search(searchText: string): Promise<any>{
        const json = await (await fetch(this.URI.concat(`&generalSearchInput=${searchText}`))).json();
        return json.foods.map(food => food.description);
    }
}