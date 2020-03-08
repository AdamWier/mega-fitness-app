import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import H1 from '../components/H1';
import USDAapiHelper from '../ApiHelpers/USDAApi';

export default function Search() {
  const USDAapi = new USDAapiHelper();

  const [searchText, updateSearchText] = useState("");

  const handleSubmit = () => {
    USDAapi.search();
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
