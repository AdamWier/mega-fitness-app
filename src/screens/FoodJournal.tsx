import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { withTheme, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { container as UserContainer } from '../store/reducers/User';
import { container as MealContainer } from '../store/reducers/MealDocument';
import MealDocument from '../Firebase/Documents/MealDocument';
import { Agenda } from 'react-native-calendars';
import FoodJournalItem from '../components/FoodJournalItem';
import TotalCard from '../components/TotalCard';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import DayHeader from '../components/DayHeader';
import { mealDocumentService, dayDocumentService } from '../Firebase/index';
import DayDocument from '../Firebase/Documents/DayDocument';

const reduceMealDocuments = (data: { [key: string]: any }[]) =>
  data.reduce((foodJournal, item) => {
    const { eatenAt } = item;
    const key = moment(eatenAt).format('YYYY-MM-DD');
    if (foodJournal.hasOwnProperty(key)) {
      foodJournal[key].push(item);
    } else foodJournal[key] = [item];
    return foodJournal;
  }, {});

const constructFoodJournalItems = (
  documentsToFormat: { [key: string]: any }[],
  date: Date
) => {
  if (documentsToFormat && documentsToFormat.length) {
    return reduceMealDocuments(documentsToFormat);
  } else {
    return {
      [moment(date).format('YYYY-MM-DD')]: [],
    };
  }
};

const compareRows = (
  r1: { [key: string]: any },
  r2: { [key: string]: any }
) => {
  return (
    r1.meal.reduce(
      (prev: { [key: string]: any }, next: { [key: string]: any }) =>
        prev.calories + next.calories,
      0
    ) !==
    r2.meal.reduce(
      (prev: { [key: string]: any }, next: { [key: string]: any }) =>
        prev.calories + next.calories,
      0
    )
  );
};

const emptyDocuments = {
  meals: [],
  day: { id: null, goalCalories: null, weight: 0 },
};

function FoodJournalPage({
  navigation,
  theme,
  user,
  updateMealDocument,
}): JSX.Element {
  const [isDayLoading, setIsDayLoading] = useState(true);
  const [documents, setDocuments] = useState(emptyDocuments);
  const [currentDate, setCurrentDate] = useState(
    moment().startOf('day').toDate()
  );

  const [isGoalOverlayVisible, toggleisGoalOverlayVisible] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');
  const [isGoalOverlayLoading, setisGoalOverlayLoading] = useState(false);

  const [isWeightOverlayVisible, toggleisWeightOverlayVisible] = useState(
    false
  );
  const [weightInput, setWeightInput] = useState('0');
  const [isWeightOverlayLoading, setisWeightOverlayLoading] = useState(false);

  const deleteMeal = async (documentId: string): Promise<void> => {
    try {
      await mealDocumentService.delete(documentId);
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

  const onWeightSubmit = async () => {
    const weightNumber = Number(weightInput);
    if (!weightNumber || Number.isNaN(weightNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        setisWeightOverlayLoading(true);
        if (documents.day.id) {
          await dayDocumentService.updateWeight(
            currentDate,
            weightNumber,
            user.uid,
            documents.day.id
          );
        } else {
          await dayDocumentService.createWeight(
            currentDate,
            weightNumber,
            user.uid
          );
        }
        setGoalCaloriesInput('0');
        toggleisWeightOverlayVisible(false);
      } catch (e) {
        Toast.showWithGravity(
          "Your goal couldn't be saved",
          Toast.SHORT,
          Toast.CENTER
        );
      }
      setisWeightOverlayLoading(false);
    }
  };

  const onGoalSubmit = async () => {
    const goalCaloriesNumber = Number(goalCaloriesInput);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        setisGoalOverlayLoading(true);
        if (documents.day.id) {
          await dayDocumentService.updateGoal(
            currentDate,
            goalCaloriesNumber,
            user.uid,
            documents.day.id
          );
        } else {
          await dayDocumentService.createGoal(
            currentDate,
            goalCaloriesNumber,
            user.uid
          );
        }
        setGoalCaloriesInput('0');
        toggleisGoalOverlayVisible(false);
      } catch (e) {
        Toast.showWithGravity(
          "Your goal couldn't be saved",
          Toast.SHORT,
          Toast.CENTER
        );
      }
      setisGoalOverlayLoading(false);
    }
  };

  const handleMealPress = (document: MealDocument) => {
    updateMealDocument(document);
    navigation.navigate('Meal');
  };

  const getNewEatenAt = () => {
    const selectedDateMoment = moment(currentDate);
    if (selectedDateMoment.isSame(moment(), 'day')) {
      return new Date();
    } else {
      return selectedDateMoment.startOf('day').toDate();
    }
  };

  const onDayPress = useCallback(
    async (date: Date) => {
      try {
        setIsDayLoading(true);
        setDocuments(emptyDocuments);
        const meals = await mealDocumentService.findByDate(date, user.uid);
        const day = await dayDocumentService.findDocument(date, user.uid);
        setDocuments((documents) => ({ ...documents, meals, day }));
        setCurrentDate(date);
        setIsDayLoading(false);
      } catch (e) {
        console.log(e);
        Toast.showWithGravity('An error occurred', Toast.SHORT, Toast.CENTER);
        setIsDayLoading(false);
      }
    },
    [user.uid]
  );

  const getGoalCalories = () => {
    if (documents.day?.goalCalories) {
      return documents.day.goalCalories;
    }
    if (moment(currentDate).isSameOrAfter(new Date(), 'd')) {
      return user.goalCalories;
    }
    return 0;
  };

  useEffect(() => {
    onDayPress(currentDate);
    const unsubscribeMealsByDateListener = mealDocumentService.getFindByDateListener(
      currentDate,
      user.uid,
      (meals: { [key: string]: any }[]) => {
        setDocuments((documents) => ({
          ...documents,
          meals,
        }));
      }
    );
    const unsubscribeDayListener = dayDocumentService.getDocumentListener(
      currentDate,
      user.uid,
      (day: DayDocument) => {
        setDocuments((documents) => ({
          ...documents,
          day,
        }));
      }
    );
    return () => {
      setDocuments(emptyDocuments);
      unsubscribeMealsByDateListener();
      unsubscribeDayListener();
    };
  }, [onDayPress, currentDate, user.uid]);

  const dayHeaderProps = {
    foods: documents.meals.flatMap((document) => document.meal),
    goalCalories: getGoalCalories(),
    handleMealPress: handleMealPress,
    getNewEatenAt: getNewEatenAt,
    goalCaloriesInput: goalCaloriesInput,
    isGoalOverlayVisible: isGoalOverlayVisible,
    onGoalButtonPress: () => toggleisGoalOverlayVisible(true),
    setGoalCaloriesInput: setGoalCaloriesInput,
    toggleIsGoalOverlayVisible: toggleisGoalOverlayVisible,
    onGoalSubmit: onGoalSubmit,
    isGoalOverlayLoading: isGoalOverlayLoading,
    onWeightButtonPress: () => toggleisWeightOverlayVisible(true),
    isWeightOverlayVisible: isWeightOverlayVisible,
    toggleIsWeightOverlayVisible: toggleisWeightOverlayVisible,
    weightInput: weightInput,
    setWeightInput: setWeightInput,
    isWeightOverlayLoading: isWeightOverlayLoading,
    onWeightSubmit: onWeightSubmit,
    weight: documents.day?.weight,
  };

  const emptyItem = () =>
    isDayLoading ? (
      <ActivityIndicator size="large" />
    ) : (
      <View>
        <DayHeader {...dayHeaderProps} />
        <Text style={styles.noMeals}>No meals for this date.</Text>
      </View>
    );

  const renderItem = (item: { [key: string]: any }, isFirstItem: boolean) =>
    isFirstItem ? (
      <View>
        <DayHeader {...dayHeaderProps} />
        <TotalCard
          foods={documents.meals.flatMap((document) => document.meal)}
        />
        <FoodJournalItem
          document={item}
          onMealPress={handleMealPress}
          onDeletePress={confirmDelete}
        />
      </View>
    ) : (
      <FoodJournalItem
        document={item}
        onMealPress={handleMealPress}
        onDeletePress={confirmDelete}
      />
    );

  return (
    <Agenda
      items={constructFoodJournalItems(documents.meals, currentDate)}
      onDayPress={(date) =>
        onDayPress(moment(date.dateString).startOf('day').toDate())
      }
      firstDay={1}
      pastScrollRange={12}
      futureScrollRange={12}
      renderItem={renderItem}
      renderEmptyData={() => <ActivityIndicator size="large" />}
      renderEmptyDate={emptyItem}
      rowHasChanged={compareRows}
      markedDates={{}}
      theme={{
        agendaDayTextColor: theme.colors.text,
        agendaDayNumColor: theme.colors.text,
        agendaTodayColor: theme.colors.text,
        agendaKnobColor: theme.colors.grey0,
        backgroundColor: theme.colors.background,
        calendarBackground: theme.colors.background,
        dayTextColor: theme.colors.text,
        monthTextColor: theme.colors.text,
        dotColor: theme.colors.info,
        selectedDayBackgroundColor: theme.colors.info,
      }}
    />
  );
}

const styles = StyleSheet.create({
  noMeals: {
    marginTop: 25,
  },
});

FoodJournalPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  updateMealDocument: PropTypes.func.isRequired,
};

export default MealContainer(UserContainer(withTheme(FoodJournalPage)));
