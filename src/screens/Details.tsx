import React, { useState, useEffect } from 'react';
import { Card, ListItem, Slider, Button } from 'react-native-elements';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';
import { ScrollView } from 'react-native';
import AmountPicker from '../components/AmountPicker';
import FoodCard from '../components/FoodCard';

export default function Details({ navigation, route, meal, updateMeal }) {

  const details: USDAFoodDetails = route.params.details;

  const calculateValues = () => {
    const calories = Math.round(details.calories * amount * currentPortion.weight);
    const protein = Math.round(details.protein * amount * currentPortion.weight);
    const carbs = Math.round(details.carbs * amount * currentPortion.weight);
    const fats = Math.round(details.fats * amount * currentPortion.weight);
    return {
      calories,
      protein,
      carbs,
      fats
    };
  };

  const addFood = () => {
    const { calories, protein, fats, carbs } = currentCalculations;
      updateMeal([...meal, {
        name: details.name,
        portion: `${amount} ${currentPortion.description}`,
        calories,
        protein,
        fats,
        carbs,
      }]);
    navigation.navigate("Day");
  }

  const [amount, changeAmount] = useState(1);
  const [currentPortion, changePortion] = useState(details.portions[0]);
  const [currentCalculations, updateCurrentCalculations] = useState(calculateValues());

  useEffect(() => {
    updateCurrentCalculations(calculateValues());
  }, [amount, currentPortion]);

  return (
    <ScrollView>
      <FoodCard 
        name={details.name} 
        portion={`${amount} ${currentPortion.description}`} 
        calories={currentCalculations.calories.toString()}
        protein={currentCalculations.protein.toString()} 
        carbs={currentCalculations.carbs.toString()} 
        fats={currentCalculations.fats.toString()} 
      >
      <AmountPicker 
            amounts={details.portions} 
            selectedValue={currentPortion.description} 
            onValueChange={
              (selection) => {
                const newPortion = details.portions.find(portion => 
                  selection === portion.description
                );
                changePortion(newPortion);
              }
            } 
          />
          <Slider 
             step={1} 
             minimumValue={1} 
             maximumValue={1000} 
             value={amount} 
             onValueChange={value => changeAmount(value)}
           />
           </FoodCard>
       <Button title="Add food" onPress={() => {
         addFood();
       }} />
     </ScrollView>
  );
}
