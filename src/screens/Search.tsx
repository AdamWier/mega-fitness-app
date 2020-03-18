import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApiImpl';
import globalStyle from '../components/StyleSheet';

export default function Search({ navigation }) {
  const USDAapi = new USDAApiImpl();

  const [searchText, updateSearchText] = useState("");
  const [results, updateResults] = useState([]);

  const handleSubmit = async () => {
    updateResults(await USDAapi.search(searchText));
    updateSearchText("");
  }

  const goToFoodDetails = async (id: number) => {
    const details = await USDAapi.getDetails(id);
    navigation.navigate('Details', {details});
  }

  return (
    <View style={globalStyle.container}>
        <Text style={globalStyle.H1}>Search for food</Text>
        <TextInput style={globalStyle.textInput} value={searchText} onChangeText={(text) => updateSearchText(text)} />
        <PrimaryButton text="Search" onPress={() => handleSubmit()} />
        {results.length ?
          <FlatList data={results} renderItem={({item}) => 
            <TouchableOpacity onPress={() => goToFoodDetails(item.fdcId)}>
              <Text style={globalStyle.text}>{'\u2B24'} {item.description}</Text>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
          />
        : null}
    </View>
  );
}