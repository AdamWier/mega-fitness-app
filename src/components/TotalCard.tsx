import React from 'react';
import { Card, ListItem, withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';

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
        backgroundColor: theme.colors.primary,
        marginBottom: 20,
        }}
        title="Totals"
    >
        <ListItem
        title="Calories:"
        subtitle={getTotals().calories.toString()}
        chevron={false}
        containerStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 15,
            padding: 10,
        }}
        />
        <ListItem
        title="Protein:"
        subtitle={getTotals().protein.toString()}
        chevron={false}
        containerStyle={{
            backgroundColor: theme.colors.grey0,
            borderRadius: 15,
            padding: 10,
        }}
        />
        <ListItem
        title="Carbs:"
        subtitle={getTotals().carbs.toString()}
        chevron={false}
        containerStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 15,
            padding: 10,
        }}
        />
        <ListItem
        title="Fat:"
        subtitle={getTotals().fats.toString()}
        chevron={false}
        containerStyle={{
            backgroundColor: theme.colors.grey0,
            borderRadius: 15,
            padding: 10,
        }}
        /> 
    </Card>
  );
}

TotalCard.propTypes = {
  foods: PropTypes.array.isRequired
};

export default withTheme(TotalCard);
