import React, { useState, useEffect } from 'react';
import { Slider, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import AmountPicker from '../components/AmountPicker';
import FoodCard from '../components/FoodCard';
import { container } from '../store/reducers/Meal';
import { FormattedPortion } from '../ApiHelpers/USDA/USDAApi';

function Details({ navigation, route, meal, updateMeal }): JSX.Element {
  const { details } = route.params;

  const calculateNutrient = (nutrient: string): number =>
    Math.round(details[nutrient] * amount * currentPortion.weight);

  const calculateValues = (): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } => {
    const calories = calculateNutrient('calories');
    const protein = calculateNutrient('protein');
    const carbs = calculateNutrient('carbs');
    const fats = calculateNutrient('fats');
    return {
      calories,
      protein,
      carbs,
      fats,
    };
  };

  const [amount, changeAmount] = useState(1);
  const [currentPortion, changePortion] = useState(details.portions[0]);
  const [currentCalculations, updateCurrentCalculations] = useState(
    calculateValues()
  );

  const addFood = (): void => {
    const { calories, protein, fats, carbs } = currentCalculations;
    updateMeal([
      ...meal,
      {
        name: details.name,
        amount,
        portionDescription: currentPortion.description,
        calories,
        protein,
        fats,
        carbs,
      },
    ]);
    navigation.navigate('Meal');
  };

  useEffect(() => {
    updateCurrentCalculations(calculateValues());
  }, [amount, currentPortion]);

  return (
    <ScrollView>
      <FoodCard
        name={details.name}
        calories={currentCalculations.calories.toString()}
        protein={currentCalculations.protein.toString()}
        carbs={currentCalculations.carbs.toString()}
        fats={currentCalculations.fats.toString()}
        amount={amount ? amount.toString() : ''}
        amountDescription={currentPortion.description}
        onAmountChange={(value) => changeAmount(Number(value))}
        expanded
      >
        <AmountPicker
          amounts={details.portions}
          selectedValue={currentPortion.description}
          onValueChange={(selection: string): void => {
            const newPortion = details.portions.find(
              (portion: FormattedPortion) => selection === portion.description
            );
            changePortion(newPortion);
          }}
        />
        <Slider
          step={1}
          minimumValue={1}
          maximumValue={currentPortion.description === 'gram' ? 5000 : 20}
          value={amount}
          onValueChange={(value): void => changeAmount(Number(value))}
        />
      </FoodCard>
      <Button
        title="Add food"
        onPress={(): void => {
          addFood();
        }}
      />
    </ScrollView>
  );
}

Details.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  meal: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateMeal: PropTypes.func.isRequired,
};

export default container(Details);
