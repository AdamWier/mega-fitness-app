import React from 'react';
import { Card, withTheme, Text, Divider } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

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
        titleStyle={styles.text}
        title="Totals"
    >
      <TotalListItem
        total={getTotals().calories.toString()}
        label="Calories:"
      />
      <TotalListItem
        label="Protein:"
        total={getTotals().protein.toString()}
      />
      <TotalListItem
        label="Carbs:"
        total={getTotals().carbs.toString()}
      />
      <TotalListItem
        label="Fat:"
        total={getTotals().fats.toString()}
      /> 
    </Card>
  );
}

TotalCard.propTypes = {
  foods: PropTypes.array.isRequired
};

const TotalListItem: React.FC<any> = ({label, total}) => 
<View>
  <View style={styles.container}>
    <Text style={styles.text}>{`${label}`}</Text>
    <Text style={styles.text}>{total}</Text>
  </View>
    <Divider/>
</View>

TotalListItem.propTypes = {
  label: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10
  },
})

export default withTheme(TotalCard);
