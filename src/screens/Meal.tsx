import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet, Keyboard } from 'react-native';
import { Button, Text, withTheme, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import FoodCard from '../components/FoodCard';
import { container as MealContainer } from '../store/reducers/MealDocument';
import { container as UserContainer } from '../store/reducers/User';
import { firestoreService } from '../Firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TotalCard from '../components/TotalCard';
import moment from 'moment';

function Meal({
  navigation,
  theme,
  mealDocument,
  updateMealDocument,
  user,
}): JSX.Element {
  const mealNameInput = useRef(null);

  const { meal, eatenAt, name, id } = mealDocument;

  const [displayCalendar, toggleDisplayCalendar] = useState(false);
  const [expandedCard, changeExpandedCard] = useState(null);

  navigation.setOptions({
    title: name === 'Untitled' ? 'New meal' : name,
  });

  const removeFoodFromMeal = (mealIndex: number): void => {
    const newMeal = meal.filter(
      (mealItem: { [key: string]: any }, index: number) => index !== mealIndex
    );
    updateMealDocument({
      ...mealDocument,
      meal: newMeal,
    });
  };

  const getEatenAt = (): void => {
    toggleDisplayCalendar(true);
  };

  const sendMealToFirestore = async (): Promise<void> => {
    try {
      if (id) {
        await firestoreService.updateMeal(meal, name, user.uid, eatenAt, id);
      } else {
        await firestoreService.createMeal(meal, name, user.uid, eatenAt);
      }
      navigation.navigate('Agenda');
    } catch (e) {
      console.log(e);
    }
  };

  const setDate = (input: Date) => {
    toggleDisplayCalendar(false);
    updateMealDocument({
      ...mealDocument,
      eatenAt: input,
    });
  };

  const askToSave = (): void => {
    Alert.alert('Save', 'Do you want to save the meal?', [
      { text: 'No', onPress: () => null },
      { text: 'Yes', onPress: () => sendMealToFirestore() },
    ]);
  };

  const deleteMeal = async () => {
    try {
      await firestoreService.deleteMeal(id);
      navigation.navigate('Day', { date: eatenAt });
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete', 'Do you want to delete this meal?', [
      { text: 'No', onPress: () => null },
      { text: 'Yes', onPress: () => deleteMeal() },
    ]);
  };

  const blurInput = useCallback(() => {
    mealNameInput.current && mealNameInput.current.blur();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', blurInput);

    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, [blurInput]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title="Add a food"
        onPress={(): void => navigation.navigate('Search')}
        buttonStyle={{
          backgroundColor: theme.colors.warning,
        }}
        containerStyle={{
          marginTop: 20,
          width: '85%',
        }}
      />
      {meal.length ? (
        <View>
          <Input
            placeholder="Enter meal name"
            value={name}
            onChangeText={(input) =>
              updateMealDocument({
                ...mealDocument,
                name: input,
              })
            }
            ref={mealNameInput}
            containerStyle={styles.input}
          />
          {meal.map((food: { [key: string]: any }, index: number) => {
            const isExpandedCard = index === expandedCard;
            return (
              <FoodCard
                name={food.name}
                amount={food.amount ? food.amount.toString() : ''}
                amountDescription={food.portionDescription}
                calories={food.calories.toString()}
                protein={food.protein.toString()}
                carbs={food.carbs.toString()}
                fats={food.fats.toString()}
                key={index}
                expanded={isExpandedCard}
              >
                <View style={styles.sideBySide}>
                  <Button
                    title="Delete food"
                    onPress={() => removeFoodFromMeal(index)}
                    buttonStyle={{
                      backgroundColor: theme.colors.danger,
                    }}
                  />
                  {isExpandedCard ? (
                    <Button
                      title="Hide details"
                      onPress={() => changeExpandedCard(null)}
                    />
                  ) : (
                    <Button
                      title="See details"
                      onPress={() => changeExpandedCard(index)}
                    />
                  )}
                </View>
              </FoodCard>
            );
          })}
          <TotalCard foods={meal} />
          <DateTimePickerModal
            isVisible={displayCalendar}
            date={eatenAt}
            mode="datetime"
            onConfirm={setDate}
            onCancel={() => toggleDisplayCalendar(false)}
          />
          <Button
            title={`Eaten: ${moment(eatenAt).format(
              'dddd MMMM D, YYYY HH:mm'
            )}`}
            onPress={getEatenAt}
          />
          <Button
            title="Save meal"
            onPress={askToSave}
            buttonStyle={{
              backgroundColor: theme.colors.success,
            }}
          />
          {id ? (
            <Button
              title="Delete meal"
              onPress={confirmDelete}
              buttonStyle={{
                backgroundColor: theme.colors.danger,
              }}
            />
          ) : null}
        </View>
      ) : (
        <Text>No foods added to this meal</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sideBySide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    alignSelf: 'center',
  },
});

Meal.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  mealDocument: PropTypes.object.isRequired,
  updateMealDocument: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default UserContainer(MealContainer(withTheme(Meal)));
