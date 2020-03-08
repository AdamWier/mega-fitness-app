import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import H1 from '../components/H1';

export default function Search() {
  return (
    <View style={styles.test}>
        <H1 text="Search for food"/>
        <TextInput style={styles.textInput} />
        <PrimaryButton text="Search" onPress={() => console.log("press")} />
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
