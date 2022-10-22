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

  const [amount, setAmount] = useState('1');
  const [currentPortion, changePortion] = useState(details.portions[0]);
  const [calories, setCalories] = useState('0');
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fats, setFats] = useState('0');

  const calculateNutrient = useCallback(
    (nutrient: keyof FoodDetails, amount: string) =>
      (Number(amount)
        ? Math.round(
            Number(details[nutrient]) * Number(amount) * currentPortion.weight
          )
        : 0
      ).toString(),
    [currentPortion.weight, details]
  );

  const calculateAmountFromCalories = (caloriesAsString: string) => {
    const caloriesAsNumber = Number(caloriesAsString);
    return (
      Math.round(
        (caloriesAsNumber / details.calories / currentPortion.weight) * 100
      ) / 100
    ).toString();
  };
  const calculateCaloriesByAmount = (value: string) => {
    setAmount(value);
    setCalories(calculateNutrient('calories', value));
  };

  const calculateAmountByCalories = (value: string) => {
    setAmount(calculateAmountFromCalories(value));
    setCalories(value);
  };

  useEffect(() => {
    setProtein(calculateNutrient('protein', amount));
    setCarbs(calculateNutrient('carbs', amount));
    setFats(calculateNutrient('fats', amount));
  }, [amount, calculateNutrient, setProtein, setCarbs, setFats]);

  const amountIsCorrect = () => {
    return amount !== '' && amount !== '0' && !!Number(amount);
  };

  const addFood = () => {
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

  return (
    <ScrollView>
      <FoodCard
        name={details.name}
        calories={calories}
        protein={protein}
        carbs={carbs}
        fats={fats}
        amount={amount}
        amountDescription={currentPortion.description}
        onAmountChange={calculateCaloriesByAmount}
        onCalorieChange={calculateAmountByCalories}
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
