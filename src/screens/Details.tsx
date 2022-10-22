import React, { useState, useEffect } from 'react';
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
import { useCallback } from 'react';

function Details({
  navigation,
  route,
  mealDocument,
  updateMealDocument,
}: DetailsProps & ConnectedProps<typeof container>) {
  const { details } = route.params;

  const calculateNutrient = useCallback(
    (
      nutrient: keyof FoodDetails,
      amount: string,
      currentPortionWeight: number
    ) =>
      (Number(amount) && details
        ? Math.round(
            Number(details[nutrient]) * Number(amount) * currentPortionWeight
          )
        : 0
      ).toString(),
    [details]
  );

  const [amount, setAmount] = useState('1');
  const [currentPortion, changePortion] = useState(details?.portions[0]);
  const [calories, setCalories] = useState(
    calculateNutrient('calories', amount, currentPortion?.weight || 0)
  );
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fats, setFats] = useState('0');
  const [name, setName] = useState(details?.name || '');

  const calculateAmountFromCalories = (caloriesAsString: string) => {
    if (!details || !currentPortion) return '';
    const caloriesAsNumber = Number(caloriesAsString);
    return (
      Math.round(
        (caloriesAsNumber / details.calories / currentPortion.weight) * 100
      ) / 100
    ).toString();
  };

  const calculateCaloriesByAmount = (
    value: string,
    currentPortionWeight: number
  ) => {
    setAmount(value);
    setCalories(calculateNutrient('calories', value, currentPortionWeight));
  };

  const calculateAmountByCalories = (value: string) => {
    setAmount(calculateAmountFromCalories(value));
    setCalories(value);
  };

  const onPortionChange = (selection: string): void => {
    const newPortion = (details?.portions || []).find(
      (portion: FormattedPortion) => selection === portion.description
    );
    if (newPortion) {
      changePortion(newPortion);
      calculateCaloriesByAmount(amount, newPortion.weight);
    }
  };

  useEffect(() => {
    if (!currentPortion) return;
    setProtein(calculateNutrient('protein', amount, currentPortion.weight));
    setCarbs(calculateNutrient('carbs', amount, currentPortion.weight));
    setFats(calculateNutrient('fats', amount, currentPortion.weight));
  }, [
    amount,
    calculateNutrient,
    setProtein,
    setCarbs,
    setFats,
    currentPortion,
  ]);

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
            name: name,
            amount: Number(amount),
            portionDescription: currentPortion?.description || '',
            calories: Number(calories),
            protein: Number(protein),
            fats: Number(fats),
            carbs: Number(carbs),
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
        name={name}
        calories={calories}
        protein={protein}
        carbs={carbs}
        fats={fats}
        amount={amount}
        amountDescription={currentPortion?.description}
        onAmountChange={(value) =>
          !currentPortion
            ? setAmount(value)
            : calculateCaloriesByAmount(value, currentPortion.weight)
        }
        onCalorieChange={(value) =>
          !currentPortion ? setCalories(value) : calculateAmountByCalories
        }
        expanded
        onNameChange={!details ? setName : undefined}
        onProteinChange={!details ? setProtein : undefined}
        onCarbsChange={!details ? setCarbs : undefined}
        onFatsChange={!details ? setFats : undefined}
      >
        {!!details && !!currentPortion ? (
          <AmountPicker
            amounts={details.portions}
            selectedValue={currentPortion.description}
            onValueChange={onPortionChange}
          />
        ) : null}
      </FoodCard>
      <Button title="Add food" onPress={addFood} />
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
