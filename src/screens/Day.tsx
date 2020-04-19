import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Text, Card, ListItem, withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';
import { container as UserContainer } from '../store/reducers/User';
import { container as MealContainer } from '../store/reducers/MealDocument';
import { firestoreService } from '../Firebase';
import TotalCard from '../components/TotalCard';
import MealDocument from '../Firebase/Documents/MealDocument';

const getTimeString = (time: Date): string => {
  const fullString = time.toLocaleTimeString();
  return fullString.substring(0, fullString.length - 3);
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Day({ navigation, route, theme, user, updateMealDocument }): JSX.Element {
  const currentDate: Date = route.params.date || new Date();

  const title = `${
    months[currentDate.getMonth()]
  } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  navigation.setOptions({ title });

  const [isLoading, toggleIsLoading] = useState(true);

  const [mealDocuments, setMealDocuments] = useState([]);

  const allFoods = mealDocuments.flatMap((document) => document.meal);

  const deleteMeal = async (documentId: string): Promise<void> => {
    try {
      await firestoreService.deleteMeal(documentId);
      navigation.navigate('Calendar');
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDelete = (documentId: string): void => {
    Alert.alert('Delete', 'Do you want to delete this meal?', [
      { text: 'No', onPress: () => null },
      { text: 'Yes', onPress: () => deleteMeal(documentId) },
    ]);
  };

  const getTotalCalories = (
    accumulator: number,
    currentValue: { [key: string]: any }
  ): number => accumulator + currentValue.calories;

  const handleMealPress = (document: MealDocument) => {
    updateMealDocument(document);
    navigation.navigate('Meal');
  }

  useEffect(() => {
    (async function (): Promise<void> {
      const data = await firestoreService.findMealsByDate(
        currentDate,
        user.uid
      );
      if (data) {
        setMealDocuments(data);
      }
      toggleIsLoading(false);
    })();
    return () => {
      setMealDocuments([]);
      toggleIsLoading(true);
    };
  }, [currentDate, user.uid]);

  return (
    <ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <Button
            title="Add a new meal"
            onPress={() =>handleMealPress({
              id: null,
              eatenAt: currentDate,
              meal: [],
              name: 'Untitled',
              createdAt: new Date(),
              deleted: false,
              uid: user.uid
            })}
          />
          {mealDocuments.length ? (
            <View>
              {mealDocuments.map(
                (document: MealDocument, index: number) => (
                  <Card
                    title={document.name ? document.name : 'Untitled'}
                    key={document.id}
                  >
                    <ListItem
                      key={index}
                      title={getTimeString(document.eatenAt)}
                      subtitle={
                        'Total calories: ' +
                        document.meal.reduce(getTotalCalories, 0)
                      }
                      onPress={() => handleMealPress(document)}
                    />
                    <Button
                      title="Delete meal"
                      onPress={() => confirmDelete(document.id)}
                      buttonStyle={{
                        backgroundColor: theme.colors.danger,
                      }}
                    />
                  </Card>
                )
              )}
              <TotalCard foods={allFoods} />
            </View>
          ) : (
            <Text>No meals for this date.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

Day.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  updateMealDocument: PropTypes.func.isRequired,
};

export default MealContainer(UserContainer(withTheme(Day)));
