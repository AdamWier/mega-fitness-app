import React from 'react';
import { View, Text } from 'react-native';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';
import globalStyle from '../components/StyleSheet';

export default function Search({ route }) {

  const details: USDAFoodDetails = route.params.details;

  return (
    <View style={globalStyle.container}>
        <Text style={globalStyle.H1}>Details</Text>
        <Text style={globalStyle.text}>Name: {details.name} </Text>
        <Text style={globalStyle.text}>Calories: {details.calories}</Text>
        <Text style={globalStyle.text}>Protein: {details.protein}</Text>
        <Text style={globalStyle.text}>Carbohydrates: {details.carbs}</Text>
        <Text style={globalStyle.text}>Fats: {details.fats}</Text>
    </View>
  );
}
