import React from 'react';
import { Card, ListItem } from 'react-native-elements';
import { USDAFoodDetails } from '../ApiHelpers/USDA/USDAApi';

export default function Search({ route }) {

  const details: USDAFoodDetails = route.params.details;

  return (
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
    </Card>
  );
}
