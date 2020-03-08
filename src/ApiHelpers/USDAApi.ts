import { USDA_KEY } from 'react-native-dotenv';

export default class USDAApiHelper{
    URI: string;

    constructor(){
        this.URI = `https://api.nal.usda.gov/fdc/v1/search?api_key=${USDA_KEY}&generalSearchInput`
    }

    search(): void{
        fetch(this.URI).then(result => result.json().then(json => console.log(json)));
    }
}