import React, { useState } from 'react';
import { Card, ListItem, Slider } from 'react-native-elements';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';
import { ScrollView, Picker } from 'react-native';

export default function Search({ route }) {

  const details: USDAFoodDetails = route.params.details;

  const [amount, changeAmount] = useState(1)

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
            subtitle={details.calories.toString()}
            chevron={false}
          />
          <ListItem
            title="Protein:"
            subtitle={details.protein.toString()}
            chevron={false}
          />
          <ListItem
            title="Carbs:"
            subtitle={details.carbs.toString()}
            chevron={false}
          />
          <ListItem
            title="Fat:"
            subtitle={details.fats.toString()}
            chevron={false}
          />
          <ListItem 
            title="Amount:"
            subtitle={`${amount} g`}
            chevron={false}
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
