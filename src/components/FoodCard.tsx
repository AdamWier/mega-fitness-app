import React from 'react';
import { Card, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

export default function FoodCard({
  name,
  calories,
  protein,
  carbs,
  fats,
  portion,
  children = null,
}): JSX.Element {
  return (
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
  );
}

FoodCard.propTypes = {
  name: PropTypes.string.isRequired,
  calories: PropTypes.string.isRequired,
  protein: PropTypes.string.isRequired,
  carbs: PropTypes.string.isRequired,
  fats: PropTypes.string.isRequired,
  portion: PropTypes.string.isRequired,
  // eslint-disable-next-line
  children: PropTypes.any,
};

FoodCard.defaultProps = {
  children: null,
};
