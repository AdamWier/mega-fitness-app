import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-elements';
import {
  container as UserContainer,
  UserContainerProps,
} from '../../store/reducers/User';
import {
  container as MealContainer,
  MealContainerProps,
} from '../../store/reducers/MealDocument';
import MealDocument, { AddedFood } from '../../Firebase/Documents/MealDocument';
import { Agenda } from 'react-native-calendars';
import FoodJournalItem from '../../components/FoodJournalItem';
import TotalCard from '../../components/TotalCard';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import DayHeader from './DayHeader/DayHeader';
import { mealDocumentService, dayDocumentService } from '../../Firebase/index';
import DayDocument from '../../Firebase/Documents/DayDocument';
import ActivityIndicator from '../../components/ActivityIndicator';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FoodJournalStackParams,
  FoodJournalStackScreenNames,
} from '../../Navigation/FoodJournalStack/Screens';
import { MyTheme } from '../../StyleSheet';
import { constructFoodJournalItems, emptyDocuments } from './FoodJournalLogic';
import { getTotal } from '../../utilities';

function FoodJournalPage({
  navigation,
  theme,
  user,
  updateMealDocument,
}: FoodJournalPageProps) {
  const [isDayLoading, setIsDayLoading] = useState(true);
  const [documents, setDocuments] =
    useState<{ meals: MealDocument[]; day: DayDocument }>(emptyDocuments);
  const [currentDate, setCurrentDate] = useState(
    moment().startOf('day').toDate()
  );

  const [isGoalOverlayVisible, toggleIsGoalOverlayVisible] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');
  const [isGoalOverlayLoading, setIsGoalOverlayLoading] = useState(false);

  const [isWeightOverlayVisible, toggleIsWeightOverlayVisible] =
    useState(false);
  const [weightInput, setWeightInput] = useState('0');
  const [isWeightOverlayLoading, setIsWeightOverlayLoading] = useState(false);

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

  const onWaterChange = (glasses: number) => {
    documents.day.id && user.uid
      ? dayDocumentService.updateWater(
          currentDate,
          glasses,
          user.uid,
          documents.day.id
        )
      : user.uid &&
        dayDocumentService.createWater(currentDate, glasses, user.uid);
  };

  const onWeightSubmit = async () => {
    const weightNumber = Number(weightInput);
    if (!weightNumber || Number.isNaN(weightNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        setIsWeightOverlayLoading(true);
        if (documents.day.id && user.uid) {
          await dayDocumentService.updateWeight(
            currentDate,
            weightNumber,
            user.uid,
            documents.day.id
          );
        } else {
          user.uid &&
            (await dayDocumentService.createWeight(
              currentDate,
              weightNumber,
              user.uid
            ));
        }
        setGoalCaloriesInput('0');
        toggleIsWeightOverlayVisible(false);
      } catch (e) {
        Toast.showWithGravity(
          "Your goal couldn't be saved",
          Toast.SHORT,
          Toast.CENTER
        );
      }
      setIsWeightOverlayLoading(false);
    }
  };

  const checkIsNumber = async () => {
    const goalCaloriesNumber = Number(goalCaloriesInput);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      setGoalCalories(goalCaloriesNumber);
    }
  };

  const setGoalCalories = async (goal: number) => {
    try {
      setIsGoalOverlayLoading(true);
      if (documents.day.id && user.uid) {
        await dayDocumentService.updateGoal(
          currentDate,
          goal,
          user.uid,
          documents.day.id
        );
      } else {
        user.uid &&
          (await dayDocumentService.createGoal(currentDate, goal, user.uid));
      }
      toggleIsGoalOverlayVisible(false);
    } catch (e) {
      Toast.showWithGravity(
        "Your goal couldn't be saved",
        Toast.SHORT,
        Toast.CENTER
      );
    }
    setIsGoalOverlayLoading(false);
  };

  const handleMealPress = (document: AddedFood[]) => {
    updateMealDocument(document);
    navigation.navigate(FoodJournalStackScreenNames.Meal);
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
        const meals =
          user.uid && (await mealDocumentService.findByDate(date, user.uid));
        const day =
          user.uid && (await dayDocumentService.findDocument(date, user.uid));
        meals &&
          day &&
          setDocuments((currentDocuments) => ({
            ...currentDocuments,
            meals,
            day,
          }));
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

  useEffect(() => {
    onDayPress(currentDate);
    const unsubscribeMealsByDateListener =
      user.uid &&
      mealDocumentService.getFindByDateListener(
        currentDate,
        user.uid,
        (meals: MealDocument[]) => {
          setDocuments((currentDocuments) => ({
            ...currentDocuments,
            meals,
          }));
        }
      );
    const unsubscribeDayListener =
      user.uid &&
      dayDocumentService.getDocumentListener(
        currentDate,
        user.uid,
        (day: DayDocument) => {
          setDocuments((currentDocuments) => ({
            ...currentDocuments,
            day,
          }));
        }
      );
    return () => {
      setDocuments(emptyDocuments);
      unsubscribeMealsByDateListener && unsubscribeMealsByDateListener();
      unsubscribeDayListener && unsubscribeDayListener();
    };
  }, [onDayPress, currentDate, user.uid]);

  const dayHeaderProps = {
    totalCalories: documents.meals
      .flatMap((document) => document.meal)
      .reduce(getTotal('calories'), 0),
    goalCalories: documents.day?.goalCalories ?? user.goalCalories,
    handleMealPress: handleMealPress,
    getNewEatenAt: getNewEatenAt,
    goalCaloriesInput: goalCaloriesInput,
    isGoalOverlayVisible: isGoalOverlayVisible,
    onGoalButtonPress: () => toggleIsGoalOverlayVisible(true),
    setGoalCaloriesInput: setGoalCaloriesInput,
    toggleIsGoalOverlayVisible: toggleIsGoalOverlayVisible,
    onGoalSubmit: checkIsNumber,
    isGoalOverlayLoading: isGoalOverlayLoading,
    clearGoal: () => setGoalCalories(0),
    onWeightButtonPress: () => toggleIsWeightOverlayVisible(true),
    isWeightOverlayVisible: isWeightOverlayVisible,
    toggleIsWeightOverlayVisible: toggleIsWeightOverlayVisible,
    weightInput: weightInput,
    setWeightInput: setWeightInput,
    isWeightOverlayLoading: isWeightOverlayLoading,
    onWeightSubmit: onWeightSubmit,
    weight: documents.day?.weight,
    todaysWater: documents.day?.water || 0,
    updateWaterGoal: onWaterChange,
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

  const renderItem = (item: MealDocument, isFirstItem: boolean) =>
    isFirstItem ? (
      <View>
        <DayHeader {...dayHeaderProps} />
        <TotalCard
          foods={documents.meals.flatMap((document: any) => document.meal)}
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
      rowHasChanged={() => true}
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

type FoodJournalPageProps = {
  navigation: StackNavigationProp<
    FoodJournalStackParams,
    FoodJournalStackScreenNames.FoodJournal
  >;
  theme: MyTheme;
} & UserContainerProps &
  MealContainerProps;

export default MealContainer(UserContainer(withTheme(FoodJournalPage)));
