import React from 'react';
import { Card, withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';
import TotalListItem from '../components/TotalListItem';

const getTotal = (nutrient: string): CallableFunction => (
    accumulator: number,
    currentValue: {[key: string]: any}
    ): number => accumulator + currentValue[nutrient];  

function TotalCard({
  theme,
  foods
}): JSX.Element {

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
        backgroundColor: theme.colors.info,
        marginBottom: 20,
      }}
      title="Totals"
    >
      <TotalListItem
        total={getTotals().calories.toString()}
        label="Calories:"
        isBig
      />
      <TotalListItem
        label="Protein:"
        total={getTotals().protein.toString()}
        isBig
      />
      <TotalListItem
        label="Carbs:"
        total={getTotals().carbs.toString()}
        isBig
      />
      <TotalListItem
        label="Fat:"
        total={getTotals().fats.toString()}
        isBig
      /> 
    </Card>
  );
}

TotalCard.propTypes = {
  foods: PropTypes.array.isRequired
};

export default withTheme(TotalCard);
