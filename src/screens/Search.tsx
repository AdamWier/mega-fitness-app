import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import H1 from '../components/H1';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApiImpl';

export default function Search() {
  const USDAapi = new USDAApiImpl();

  const [searchText, updateSearchText] = useState("");
  const [results, updateResults] = useState([]);

  const handleSubmit = async () => {
    const descriptions = await USDAapi.search(searchText);
    updateResults(descriptions);
    updateSearchText("");
  }

  const goToFoodDetails = (id: number) => {
    USDAapi.getDetails(id);
  }

  return (
    <View style={styles.test}>
        <H1 text="Search for food"/>
        <TextInput style={styles.textInput} value={searchText} onChangeText={(text) => updateSearchText(text)} />
        <PrimaryButton text="Search" onPress={() => handleSubmit()} />
        <FlatList data={results} renderItem={({item}) => <TouchableOpacity onPress={() => goToFoodDetails(item.fdcId)}><Text style={styles.text}>{'\u2B24'} {item.description}</Text></TouchableOpacity>} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    backgroundColor: '#FDFFFE',
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
  test: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
