import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert, StyleSheet, Keyboard } from 'react-native';
import {
  Button,
  Text,
  withTheme,
  Input,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import FoodCard from '../components/FoodCard';
import { container as MealContainer } from '../store/reducers/Meal';
import { container as UserContainer } from '../store/reducers/User'
import { firestoreService } from '../Firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TotalCard from '../components/TotalCard';

const getDateTimeString = (dateTime: Date): string => {
  const fullString = dateTime.toLocaleString();
  return fullString.substring(0, fullString.length -  8)
}

function Meal({ navigation, route, theme, meal, updateMeal, user }): JSX.Element {

  const mealNameInput = useRef(null);

  const mealDocument = route.params.document;

  const [eatenAt, changeEatenAt] = useState(mealDocument.eatenAt);
  const [displayCalendar, toggleDisplayCalendar] = useState(false);
  const [mealName, changeMealName] = useState(mealDocument.name || "");
  const [documentId, setDocumentId] = useState(null);
  const [expandedCard, changeExpandedCard] = useState(null);

  navigation.setOptions({ title: mealName === "Untitled" ? "New meal" : mealName });

  const removeFoodFromMeal = (mealIndex: number): void => {
    const updatedArray = meal.filter((meal: {[key:string]: any}, index: number) => index !== mealIndex);
    updateMeal(updatedArray);
  }

  const getEatenAt = (): void => {
    toggleDisplayCalendar(true);
  }

  const sendMealToFirestore = async (datetime: Date): Promise<void> => {
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
  }

  const askToSave = (): void => {
    Alert.alert("Save", "Do you want to save the meal?", [
      {text: "No", onPress: () => null},
      {text: "Yes", onPress: () => sendMealToFirestore(eatenAt)},
    ]);
  }

  const deleteMeal = async () => {
    try{
      await firestoreService.deleteMeal(documentId);
      navigation.navigate('Day', {date: eatenAt});
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

  const blurInput = () => {
    mealName.current && mealNameInput.current.blur();
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', blurInput)

    const document = route.params.document;
    updateMeal(document.meal);
    changeEatenAt(document.eatenAt);
    setDocumentId(document.id);

    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
    }
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
          title="Add a food"
          onPress={(): void => navigation.navigate('Search')}
          buttonStyle={{
            backgroundColor: theme.colors.warning
          }}
          containerStyle={{
            marginTop: 20,
            width: '85%'
          }}
        />
        {meal.length ? (
          <View>
            <Input 
              placeholder="Enter meal name"
              value={mealName}
              onChangeText={(value) => changeMealName(value)} 
              ref={mealNameInput}
              containerStyle={styles.input}
            />
            {meal.map((food: {[key: string]: any }, index: number) => {
              const isExpandedCard = index === expandedCard;
              return <FoodCard
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
                      backgroundColor: theme.colors.danger
                    }}
                  />
                  {isExpandedCard ?
                    <Button
                      title="Hide details"
                      onPress={() => changeExpandedCard(null)}
                    />
                  : <Button
                      title="See details"
                      onPress={() => changeExpandedCard(index)}
                    />
                  }
                </View>
              </FoodCard>
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
              title={`Eaten at: ${getDateTimeString(eatenAt)}`}
              onPress={getEatenAt} 
            />
            <Button
              title="Save meal"
              onPress={askToSave} 
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
        ) :  <Text>No foods added to this meal</Text>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  sideBySide: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
   alignSelf: 'center'
  }
})

Meal.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  meal: PropTypes.arrayOf(PropTypes.object).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  updateMeal: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default UserContainer(MealContainer(withTheme(Meal)));
