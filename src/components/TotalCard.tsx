import React from 'react';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import TotalListItem from '../components/TotalListItem';

const getTotal = (nutrient: string): CallableFunction => (
  accumulator: number,
  currentValue: { [key: string]: any }
): number => accumulator + currentValue[nutrient];

function TotalCard({ foods }): JSX.Element {
  const getTotals = (): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } => {
    const calories = foods.reduce(getTotal('calories'), 0);
    const protein = foods.reduce(getTotal('protein'), 0);
    const carbs = foods.reduce(getTotal('carbs'), 0);
    const fats = foods.reduce(getTotal('fats'), 0);
    return {
      calories,
      protein,
      carbs,
      fats,
    };
  };

  return (
    <Card
      containerStyle={{
        marginBottom: 20,
      }}
      title="Totals"
    >
      <TotalListItem
        total={getTotals().calories.toString()}
        label="Calories:"
      />
      <TotalListItem label="Protein:" total={getTotals().protein.toString()} />
      <TotalListItem label="Carbs:" total={getTotals().carbs.toString()} />
      <TotalListItem label="Fat:" total={getTotals().fats.toString()} />
    </Card>
  );
}

TotalCard.propTypes = {
  foods: PropTypes.array.isRequired,
};

export default TotalCard;
