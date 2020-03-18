import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, SearchBar, Button, ListItem } from 'react-native-elements';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApiImpl';

export default function Search({ navigation }) {
  const USDAapi = new USDAApiImpl();

  const [searchText, updateSearchText] = useState("");
  const [results, updateResults] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async () => {
    if (searchText){
      setLoadingState(true);
      updateResults(await USDAapi.search(searchText));
      setLoadingState(false);
      updateSearchText("");
    }
  }

  const goToFoodDetails = async (id: number) => {
    const details = await USDAapi.getDetails(id);
    navigation.navigate('Details', {details});
  }

  return (
    <View>
        <Text h1>Search for food</Text>
        <SearchBar value={searchText} onChangeText={(text) => updateSearchText(text)} />
        <Button 
          type={!searchText ? "outline" : "solid"} 
          disabled={!searchText} 
          loading={loadingState} 
          raised 
          title="Search" 
          onPress={() => handleSubmit()} 
        />
        <FlatList 
          data={results} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => 
            <ListItem 
              onPress={() => goToFoodDetails(item.fdcId)}
              title={item.description}
            />
          }
        />
    </View>
  );
};