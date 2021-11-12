import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-native-elements';
import { ScrollView, Alert } from 'react-native';
import AmountPicker from '../components/AmountPicker';
import FoodCard from '../components/FoodCard';
import { container } from '../store/reducers/MealDocument';
import { FoodDetails, FormattedPortion } from '../ApiHelpers/CommonAPITypes';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src';
import {
  FoodJournalStackParams,
  FoodJournalStackScreenNames,
} from '../Navigation/FoodJournalStack/Screens';
import { ConnectedProps } from 'react-redux';
import { RouteProp } from '@react-navigation/native';

function Details({
  navigation,
  route,
  mealDocument,
  updateMealDocument,
}: DetailsProps & ConnectedProps<typeof container>) {
  const { details } = route.params;

  const [amount, changeAmount] = useState('1');
  const [currentPortion, changePortion] = useState(details.portions[0]);

  const calculateNutrient = useCallback(
    (nutrient: keyof FoodDetails): number =>
      Number(amount)
        ? Math.round(
            Number(details[nutrient]) * Number(amount) * currentPortion.weight
          )
        : 0,
    [amount, currentPortion.weight, details]
  );

  const calculateValues = useCallback((): {
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
  }, [calculateNutrient]);

  const [currentCalculations, updateCurrentCalculations] = useState(
    calculateValues()
  );

  const amountIsCorrect = () => {
    return amount !== '' && amount !== '0' && !!Number(amount);
  };

  const addFood = () => {
    const { calories, protein, fats, carbs } = currentCalculations;
    if (amountIsCorrect()) {
      updateMealDocument({
        ...mealDocument,
        meal: [
          ...mealDocument.meal,
          {
            name: details.name,
            amount: Number(amount),
            portionDescription: currentPortion.description,
            calories,
            protein,
            fats,
            carbs,
          },
        ],
      });
      navigation.navigate(FoodJournalStackScreenNames.Meal);
    } else {
      Alert.alert('Warning', 'You must enter a valid amount.');
    }
  };

  useEffect(() => {
    updateCurrentCalculations(calculateValues());
  }, [calculateValues]);

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
        onAmountChange={(value) => changeAmount(value)}
        expanded
      >
        <AmountPicker
          amounts={details.portions}
          selectedValue={currentPortion.description}
          onValueChange={(selection: string): void => {
            const newPortion = details.portions.find(
              (portion: FormattedPortion) => selection === portion.description
            );
            newPortion && changePortion(newPortion);
          }}
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

interface DetailsProps {
  navigation: StackNavigationProp<
    FoodJournalStackParams,
    FoodJournalStackScreenNames.Details
  >;
  route: RouteProp<FoodJournalStackParams, FoodJournalStackScreenNames.Details>;
}

export default container(Details);
