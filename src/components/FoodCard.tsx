import React from 'react';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import TotalListItem from '../components/TotalListItem';

export default function FoodCard({
  name,
  calories,
  protein,
  carbs,
  fats,
  portion,
  children = null,
  expanded = false,
}): JSX.Element {
  return (
    <Card
      title={name}
    >
      <TotalListItem label="Calories:" total={calories} chevron={false} />
      {expanded ? 
        <View> 
          <TotalListItem label="Protein:" total={protein} chevron={false} />
          <TotalListItem label="Carbs:" total={carbs} chevron={false} />
          <TotalListItem label="Fat:" total={fats} chevron={false} />
        </View> 
      : null}
      <TotalListItem label="Amount:" total={portion} chevron={false} />
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
  children:  PropTypes.oneOfType([ 
    PropTypes.node, 
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

FoodCard.defaultProps = {
  children: null,
};
