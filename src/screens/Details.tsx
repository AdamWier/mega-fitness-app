import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import H1 from '../components/H1';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';

export default function Search({ route }) {

    const details: USDAFoodDetails = route.params.details;

  return (
    <View style={styles.container}>
        <H1 text="Details" />
        <Text style={styles.text}>Name: {details.name} </Text>
        <Text style={styles.text}>Calories: {details.calories}</Text>
        <Text style={styles.text}>Protein: {details.protein}</Text>
        <Text style={styles.text}>Carbohydrates: {details.carbs}</Text>
        <Text style={styles.text}>Fats: {details.fats}</Text>
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#222222',
  }
});
