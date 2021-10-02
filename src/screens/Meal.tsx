import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
  BackHandler,
} from 'react-native';
import { Button, Text, withTheme, Input, Divider } from 'react-native-elements';
import FoodCard from '../components/FoodCard';
import { container as MealContainer } from '../store/reducers/MealDocument';
import {
  container as UserContainer,
  UserContainerProps,
} from '../store/reducers/User';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TotalCard from '../components/TotalCard';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { mealDocumentService, dayDocumentService } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FoodJournalStackParams,
  FoodJournalStackScreens,
} from '../Navigation/FoodJournalStack/Screens';
import { MyTheme } from '../StyleSheet';
import MealDocument from '../Firebase/Documents/MealDocument';

function Meal({
  navigation,
  theme,
  mealDocument,
  updateMealDocument,
  user,
}: MealProps) {
  const mealNameInput = useRef<Input>();

  const { meal, eatenAt, name, id } = mealDocument;

  const [displayMealCalendar, toggleDisplayMealCalendar] = useState(false);
  const [displayCopyCalendar, toggleDisplayCopyCalendar] = useState(false);
  const [expandedCard, changeExpandedCard] = useState<number | null>(null);

  navigation.setOptions({
    title: name || 'New meal',
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

  const saveMeal = async (): Promise<void> => {
    if (!user) return;
    try {
      if (id) {
        await mealDocumentService.update(meal, name, user.uid, eatenAt, id);
      } else {
        await mealDocumentService.create(meal, name, user.uid, eatenAt);
        if (moment(eatenAt).isSame(new Date(), 'd')) {
          const dayDocument = await dayDocumentService.findDocument(
            eatenAt,
            user.uid
          );
          if (user.goalCalories && !dayDocument.goalCalories) {
            await dayDocumentService.createGoal(
              eatenAt,
              user.goalCalories,
              user.uid
            );
          }
        }
      }
      navigation.navigate(FoodJournalStackScreens.FoodJournal);
    } catch (e) {
      console.log(e);
    }
  };

  const setDate = (input: Date) => {
    toggleDisplayMealCalendar(false);
    updateMealDocument({
      ...mealDocument,
      eatenAt: input,
    });
  };

  const askToSave = (cancelCallback?: Function): void => {
    Alert.alert('Save', 'Do you want to save the meal?', [
      { text: 'No', onPress: () => (cancelCallback ? cancelCallback() : null) },
      { text: 'Yes', onPress: () => saveMeal() },
    ]);
  };

  const deleteMeal = async () => {
    try {
      id && (await mealDocumentService.delete(id));
      navigation.navigate(FoodJournalStackScreens.FoodJournal);
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

  const copyMeal = async (input: Date) => {
    toggleDisplayCopyCalendar(false);
    user && (await mealDocumentService.create(meal, name, user.uid, input));
  };

  const onBackPress = () => {
    if (meal.length) {
      askToSave(() => navigation.navigate(FoodJournalStackScreens.FoodJournal));
      return true;
    }
    return false;
  };

  const blurInput = useCallback(() => {
    mealNameInput?.current?.blur();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', blurInput);

    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, [blurInput]);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        placeholder="Enter meal name"
        value={name}
        onChangeText={(input) =>
          updateMealDocument({
            ...mealDocument,
            name: input,
          })
        }
        ref={mealNameInput as RefObject<Input>}
        containerStyle={styles.input}
      />
      <Button
        title="Add a food"
        onPress={(): void =>
          navigation.navigate(FoodJournalStackScreens.Search)
        }
        buttonStyle={{
          backgroundColor: theme.colors.warning,
        }}
        containerStyle={styles.addButtonContainer}
      />
      {meal.length ? (
        <View>
          <Button
            title={`Eaten: ${moment(eatenAt).format(
              'dddd MMMM D, YYYY HH:mm'
            )}`}
            onPress={() => toggleDisplayMealCalendar(true)}
          />
          <DateTimePickerModal
            isVisible={displayMealCalendar}
            date={eatenAt}
            mode="datetime"
            onConfirm={setDate}
            onCancel={() => toggleDisplayMealCalendar(false)}
          />
          <TotalCard foods={meal} />
          <Button
            title="Save meal"
            onPress={() => askToSave()}
            buttonStyle={{
              backgroundColor: theme.colors.success,
            }}
          />
          {id ? (
            <View>
              <Button
                title="Delete meal"
                onPress={confirmDelete}
                buttonStyle={{
                  backgroundColor: theme.colors.danger,
                }}
              />
              <Button
                title="Copy this meal to another day"
                onPress={() => toggleDisplayCopyCalendar(true)}
                buttonStyle={{
                  backgroundColor: theme.colors.warning,
                }}
              />
              <DateTimePickerModal
                isVisible={displayCopyCalendar}
                date={eatenAt}
                mode="datetime"
                onConfirm={copyMeal}
                onCancel={() => toggleDisplayCopyCalendar(false)}
              />
            </View>
          ) : null}

          <Divider />

          {meal.map((food, index) => {
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
  addButtonContainer: {
    marginTop: 20,
    width: '70%',
  },
});

type MealProps = {
  navigation: StackNavigationProp<
    FoodJournalStackParams,
    FoodJournalStackScreens.Meal
  >;
  theme: MyTheme;
  mealDocument: MealDocument;
  updateMealDocument: (value: MealDocument) => void;
} & UserContainerProps;

export default UserContainer(MealContainer(withTheme(Meal)));
