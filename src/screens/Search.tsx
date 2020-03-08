import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import H1 from '../components/H1';

export default function Search() {
  const [searchText, updateSearchText] = useState("");

  const handleSubmit = () => {
    console.log(searchText);
    fetch(`https://swapi.co/api/people/1`).then(result => result.json().then(json => console.log(json)));
    updateSearchText("");
  }

  return (
    <View style={styles.test}>
        <H1 text="Search for food"/>
        <TextInput style={styles.textInput} value={searchText} onChangeText={(text) => updateSearchText(text)} />
        <PrimaryButton text="Search" onPress={() => handleSubmit()} />
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
    fontSize: 30,
    textAlign: 'center',
  },
  test: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
