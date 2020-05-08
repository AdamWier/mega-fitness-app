import React from 'react';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import TotalListItem from '../components/TotalListItem';
import { View } from 'react-native';

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
      titleStyle={{
        fontSize: 15,
      }}
      title="Totals"
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <TotalListItem
          total={getTotals().calories.toString()}
          label="Calories"
          isColumn
        />
        <TotalListItem
          label="Protein"
          total={getTotals().protein.toString()}
          isColumn
        />
        <TotalListItem
          label="Carbs"
          total={getTotals().carbs.toString()}
          isColumn
        />
        <TotalListItem
          label="Fat"
          total={getTotals().fats.toString()}
          isColumn
        />
      </View>
    </Card>
  );
}

TotalCard.propTypes = {
  foods: PropTypes.array.isRequired,
};

export default TotalCard;
