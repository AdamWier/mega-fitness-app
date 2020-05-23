import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { container as UserContainer } from '../store/reducers/User';
import { container as MealContainer } from '../store/reducers/MealDocument';
import { firestoreService } from '../Firebase';
import MealDocument from '../Firebase/Documents/MealDocument';
import { Agenda } from 'react-native-calendars';
import AgendaItem from '../components/AgendaItem';
import TotalCard from '../components/TotalCard';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import DayHeader from '../components/DayHeader';

const reduceMealDocuments = (data: { [key: string]: any }[]) =>
  data.reduce((agenda, item) => {
    const { eatenAt } = item;
    const key = moment(eatenAt).format('YYYY-MM-DD');
    if (agenda.hasOwnProperty(key)) {
      agenda[key].push(item);
    } else agenda[key] = [item];
    return agenda;
  }, {});

const constructAgendaItems = (
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

function AgendaPage({
  navigation,
  theme,
  user,
  updateMealDocument,
}): JSX.Element {
  const [documents, setDocuments] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    moment().startOf('day').toDate()
  );
  const [isOverlayVisible, toggleIsOverlayVisible] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);
  const [dayDocument, setDayDocument] = useState(null);

  const deleteMeal = async (documentId: string): Promise<void> => {
    try {
      await firestoreService.deleteMeal(documentId);
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

  const onGoalButtonPress = () => {
    toggleIsOverlayVisible(true);
  };

  const checkIsNumber = async () => {
    const goalCaloriesNumber = Number(goalCaloriesInput);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        setIsOverlayLoading(true);
        await firestoreService.createDayGoal(
          currentDate,
          goalCaloriesNumber,
          user.uid
        );
        setGoalCaloriesInput('0');
        toggleIsOverlayVisible(false);
        setIsOverlayLoading(false);
      } catch (e) {
        Toast.showWithGravity(
          "Your goal couldn't be saved",
          Toast.SHORT,
          Toast.CENTER
        );
      }
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
      setCurrentDate(date);
      const mealDocumentsReceived = await firestoreService.findMealsByDate(
        date,
        user.uid
      );
      setDocuments(mealDocumentsReceived);
      const dayDocumentReceived = await firestoreService.findDayDocument(
        date,
        user.uid
      );
      setDayDocument(dayDocumentReceived);
    },
    [user.uid]
  );

  useEffect(() => {
    onDayPress(currentDate);
    const unsubscribeMealsByDateListener = firestoreService.getFindMealsByDateListener(
      currentDate,
      user.uid,
      (documentsReceived: { [key: string]: any }[]) => {
        setDocuments(documentsReceived);
      }
    );
    const unsubscribeDayListener = firestoreService.getDayDocumentListener(
      currentDate,
      user.uid,
      (documentReceived: { [key: string]: any }) => {
        setDayDocument(documentReceived);
      }
    );
    return () => {
      setDocuments([]);
      unsubscribeMealsByDateListener();
      unsubscribeDayListener();
    };
  }, [onDayPress, currentDate, user.uid]);

  const emptyItem = () => (
    <View>
      <DayHeader
        handleMealPress={handleMealPress}
        getNewEatenAt={getNewEatenAt}
        goalCaloriesInput={goalCaloriesInput}
        isOverlayVisible={isOverlayVisible}
        onGoalButtonPress={onGoalButtonPress}
        setGoalCaloriesInput={setGoalCaloriesInput}
        toggleIsOverlayVisible={toggleIsOverlayVisible}
        checkIsNumber={checkIsNumber}
        isOverlayLoading={isOverlayLoading}
        user={user}
      />
      <Text style={styles.noMeals}>No meals for this date.</Text>
    </View>
  );

  const renderItem = (item: { [key: string]: any }, isFirstItem: boolean) =>
    isFirstItem ? (
      <View>
        <DayHeader
          goalCalories={dayDocument ? dayDocument.goalCalories : null}
          handleMealPress={handleMealPress}
          getNewEatenAt={getNewEatenAt}
          goalCaloriesInput={goalCaloriesInput}
          isOverlayVisible={isOverlayVisible}
          onGoalButtonPress={onGoalButtonPress}
          setGoalCaloriesInput={setGoalCaloriesInput}
          toggleIsOverlayVisible={toggleIsOverlayVisible}
          checkIsNumber={checkIsNumber}
          isOverlayLoading={isOverlayLoading}
          user={user}
        />
        <TotalCard foods={documents.flatMap((document) => document.meal)} />
        <AgendaItem
          document={item}
          onMealPress={handleMealPress}
          onDeletePress={confirmDelete}
        />
      </View>
    ) : (
      <AgendaItem
        document={item}
        onMealPress={handleMealPress}
        onDeletePress={confirmDelete}
      />
    );

  return (
    <Agenda
      items={constructAgendaItems(documents, currentDate)}
      onDayPress={(date) =>
        onDayPress(moment(date.dateString).startOf('day').toDate())
      }
      firstDay={1}
      pastScrollRange={12}
      futureScrollRange={12}
      renderItem={renderItem}
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

AgendaPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  updateMealDocument: PropTypes.func.isRequired,
};

export default MealContainer(UserContainer(withTheme(AgendaPage)));
