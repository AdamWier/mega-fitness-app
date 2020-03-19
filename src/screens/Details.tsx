import React, { useState, useEffect } from 'react';
import { Card, ListItem, Slider } from 'react-native-elements';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';
import { ScrollView } from 'react-native';
import AmountPicker from '../components/AmountPicker';

export default function Details({ route }) {

  const details: USDAFoodDetails = route.params.details;

  const calculateValues = () => {
    const calories = Math.round(details.calories * amount * currentPortion.weight).toString();
    const protein = Math.round(details.protein * amount * currentPortion.weight).toString();
    const carbs = Math.round(details.carbs * amount * currentPortion.weight).toString();
    const fats = Math.round(details.fats * amount * currentPortion.weight).toString();
    return {
      calories,
      protein,
      carbs,
      fats
    }
  }

  const [amount, changeAmount] = useState(1);
  const [currentPortion, changePortion] = useState(details.portions[0]);
  const [currentCalculations, updateCurrentCalculations] = useState(calculateValues());

  useEffect(() => {
    updateCurrentCalculations(calculateValues());
  }, [amount, currentPortion])

  return (
    <ScrollView>
      <Card title="Details">
          <ListItem
            title="Name:"
            subtitle={details.name}
            chevron={false}
          />
          <ListItem
            title="Calories:"
            subtitle={currentCalculations.calories}
            chevron={false}
          />
          <ListItem
            title="Protein:"
            subtitle={currentCalculations.protein}
            chevron={false}
          />
          <ListItem
            title="Carbs:"
            subtitle={currentCalculations.carbs}
            chevron={false}
          />
          <ListItem
            title="Fat:"
            subtitle={currentCalculations.fats}
            chevron={false}
          />
          <ListItem 
            title="Amount:"
            subtitle={`${amount} ${currentPortion.description}`}
            chevron={false}
          />
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
       </Card>
     </ScrollView>
  );
}
