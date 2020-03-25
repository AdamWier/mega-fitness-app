import React from 'react';
import { Card, ListItem } from 'react-native-elements';

export default 
  ({ 
    name, 
    calories, 
    protein, 
    carbs, 
    fats, 
    portion, 
    children 
  }) =>
  <Card>
      <ListItem
      title="Name:"
      subtitle={name}
      chevron={false}
    />
    <ListItem
      title="Calories:"
      subtitle={calories}
      chevron={false}
    />
    <ListItem
      title="Protein:"
      subtitle={protein}
      chevron={false}
    />
    <ListItem
      title="Carbs:"
      subtitle={carbs}
      chevron={false}
    />
    <ListItem
      title="Fat:"
      subtitle={fats}
      chevron={false}
    />
    <ListItem 
      title="Amount:"
      subtitle={portion}
      chevron={false}
    />
    {children}
  </Card>