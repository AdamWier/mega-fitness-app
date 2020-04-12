import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import {
  Button,
  Text,
  Divider,
  Card,
  ListItem,
  withTheme,
  Input,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import FoodCard from '../components/FoodCard';
import { container as MealContainer } from '../store/reducers/Meal';
import { container as UserContainer } from '../store/reducers/User'
import { firestoreService } from '../Firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getTotal = (nutrient: string): CallableFunction => (
  accumulator: number,
  currentValue: {[key: string]: any}
  ): number => accumulator + currentValue[nutrient];
  
  function Day({ navigation, route, theme, meal, updateMeal, user }): JSX.Element {

  const currentDate = route.params.date || new Date();

  const title = currentDate.toLocaleString('en');
  navigation.setOptions({ title });

  const [isLoading, toggleIsLoading] = useState(true);

  const [eatenAt, changeEatenAt] = useState(currentDate);

  const [displayCalendar, toggleDisplayCalendar] = useState(false);

  const [mealName, changeMealName] = useState('')

  const [documentId, setDocumentId] = useState(null);

  const getTotals = (): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } => {
    const calories = meal.reduce(getTotal('calories'), 0);
    const protein = meal.reduce(getTotal('protein'), 0);
    const carbs = meal.reduce(getTotal('carbs'), 0);
    const fats = meal.reduce(getTotal('fats'), 0);
    return {
      calories,
      protein,
      carbs,
      fats,
    };
  };

  const getEatenAt = (): void => {
    toggleDisplayCalendar(true);
  }

  const sendMealToFirestore = async (datetime: Date): Promise<void> => {
    const calories = getTotals().calories;
    try {
      if(documentId){
        await firestoreService.updateMeal(meal, mealName, user.uid, datetime, documentId);        
      } else{
        await firestoreService.createMeal(meal, mealName, user.uid, datetime);
      }
      navigation.navigate('Calendar');
    } catch (e) {
      console.log(e);
    }
  }

  const setDate = (datetime: Date) => {
    toggleDisplayCalendar(false);
    changeEatenAt(datetime);
    askToSave(datetime);
  }

  const askToSave = (datetime: Date): void => {
    Alert.alert("Save", "Do you want to save the meal?", [
      {text: "No", onPress: () => null},
      {text: "Yes", onPress: () => sendMealToFirestore(datetime)},
    ]);
  }

  const deleteMeal = async () => {
    try{
      await firestoreService.deleteMeal(documentId);
      navigation.navigate('Calendar');
    } catch (e) {
      console.log(e);
    }
  }

  const confirmDelete = () => {
    Alert.alert("Delete", "Do you want to delete this meal?", [
      {text: "No", onPress: () => null},
      {text: "Yes", onPress: () => deleteMeal()}
    ]);
  }
  useEffect(() => {
    (async function (): Promise<void>{
      const data = await firestoreService.findMealsByDate(currentDate, user.uid);
      if (data){
        updateMeal(data.meal);
        changeEatenAt(data.eatenAt);
        changeMealName(data.mealName);
        setDocumentId(data.id)
      }
      toggleIsLoading(false);
    })();
    return () => {
      updateMeal("");
      changeEatenAt(currentDate);
      changeMealName("");
      toggleIsLoading(true);
      setDocumentId(null);
    }
  }, [currentDate])

  return (
    <ScrollView>
      {isLoading ? 
        <ActivityIndicator size="large" /> 
        : <View>
          {meal.length ? (
            meal.map((food: {[key: string]: any }, index: number) => (
              <FoodCard
                name={food.name}
                portion={food.portion}
                calories={food.calories.toString()}
                protein={food.protein.toString()}
                carbs={food.carbs.toString()}
                fats={food.fats.toString()}
                key={index}
              />
            ))
          ) : (
            <Text>No foods added to this meal</Text>
          )}
          <Button
            title="Add a food"
            onPress={(): void => navigation.navigate('Search')}
          />
          {meal.length ? (
            <View>
              <Divider />
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
              <Input 
                placeholder="Enter meal name"
                value={mealName}
                onChangeText={(value) => changeMealName(value)} 
              />
              <DateTimePickerModal
                isVisible={displayCalendar}
                date={eatenAt}
                mode="datetime"
                onConfirm={setDate}
                onCancel={() => toggleDisplayCalendar(false)}
              />
              <Text>{eatenAt.toString()}</Text>
              <Button
                title="Save meal"
                onPress={getEatenAt} 
                buttonStyle={{
                  backgroundColor: theme.colors.success
                }}
              />
              {documentId ? 
                <Button
                  title="Delete meal"
                  onPress={confirmDelete}
                  buttonStyle={{
                    backgroundColor: theme.colors.danger
                  }}
                /> 
              : null}
            </View>
          ) : null}
        </View>
      }
    </ScrollView>
  );
}

Day.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  meal: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserContainer(MealContainer(withTheme(Day)));
