import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { withTheme, Text, Button } from 'react-native-elements';
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
import GoalOverlay from '../components/GoalOverlay';

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
  const [goalCalories, setGoalCalories] = useState(null);

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

  const checkIsNumber = () => {
    const goalCaloriesNumber = Number(goalCalories);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      // firestoreService.createDayGoal(currentDate, goalCalories, user);
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
      const documentsReceived = await firestoreService.findMealsByDate(
        date,
        user.uid
      );
      setDocuments(documentsReceived);
    },
    [user.uid]
  );

  useEffect(() => {
    onDayPress(currentDate);
    const unsubscribe = firestoreService.getFindMealsByDateListener(
      currentDate,
      user.uid,
      (documentsReceived: { [key: string]: any }[]) => {
        setDocuments(documentsReceived);
      }
    );
    return () => {
      setDocuments([]);
      unsubscribe();
    };
  }, [onDayPress, currentDate, user.uid]);

  const emptyItem = () => (
    <View style={styles.emptyItem}>
      <NewMealButton />
      <Text style={styles.noMeals}>No meals for this date.</Text>
    </View>
  );

  const NewMealButton = () => (
    <Button
      title="Add a new meal"
      onPress={() =>
        handleMealPress({
          id: null,
          eatenAt: getNewEatenAt(),
          meal: [],
          name: 'Untitled',
          createdAt: new Date(),
          deleted: false,
          uid: user.uid,
        })
      }
    />
  );

  const renderItem = (document: { [key: string]: any }, isFirstItem: boolean) =>
    isFirstItem ? (
      <View>
        <NewMealButton />
        <GoalOverlay
          goalCalories={goalCalories}
          isOverlayVisible={isOverlayVisible}
          onGoalButtonPress={onGoalButtonPress}
          setGoalCalories={setGoalCalories}
          toggleIsOverlayVisible={toggleIsOverlayVisible}
          onConfirmButtonPress={checkIsNumber}
        />
        <TotalCard foods={documents.flatMap((document) => document.meal)} />
        <AgendaItem
          document={document}
          onMealPress={handleMealPress}
          onDeletePress={confirmDelete}
        />
      </View>
    ) : (
      <AgendaItem
        document={document}
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
  emptyItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  noMeals: {
    marginTop: 50,
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
