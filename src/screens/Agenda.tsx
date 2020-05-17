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

const reduceMealDocuments = (data: { [key: string]: any }[]) =>
  data.reduce((agenda, item) => {
    const { eatenAt } = item;
    const key = moment(eatenAt).format('YYYY-MM-DD');
    if (agenda.hasOwnProperty(key)) {
      agenda[key].push(item);
    } else agenda[key] = [item];
    return agenda;
  }, {});

function AgendaPage({
  navigation,
  theme,
  user,
  updateMealDocument,
}): JSX.Element {
  const [agendaItems, setAgendaItems] = useState();

  const [currentDate, setCurrentDate] = useState(
    moment().startOf('day').toDate()
  );

  const [allFoods, setAllFoods] = useState([]);

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

  const handleMealPress = (document: MealDocument) => {
    updateMealDocument(document);
    navigation.navigate('Meal');
  };

  const getNewEatenAt = () => {
    const startOfDay = moment(new Date()).startOf('day');
    const endOfDay = moment(startOfDay).endOf('day');
    const currentMoment = moment(currentDate);
    if (currentMoment.isBetween(startOfDay, endOfDay)) {
      return new Date();
    } else {
      return currentMoment.startOf('day').toDate();
    }
  };

  const adaptDocuments = (documents: { [key: string]: any }[], date: Date) => {
    if (documents && documents.length) {
      setAllFoods(documents.flatMap((document) => document.meal));
      setAgendaItems(reduceMealDocuments(documents));
    } else {
      setAgendaItems({
        [moment(date).format('YYYY-MM-DD')]: [],
      });
    }
  };

  const onDayPress = useCallback(
    async (date: Date) => {
      setCurrentDate(date);
      const documents = await firestoreService.findMealsByDate(
        date,
        user.uid,
        (documents: { [key: string]: any }[]) => {
          adaptDocuments(documents, date);
        }
      );
      adaptDocuments(documents, date);
    },
    [user.uid]
  );

  useEffect(() => {
    onDayPress(currentDate);
  }, [onDayPress, currentDate]);

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
        <TotalCard foods={allFoods} />
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
      items={agendaItems}
      onDayPress={(date) =>
        onDayPress(moment(date.dateString).startOf('day').toDate())
      }
      pastScrollRange={12}
      futureScrollRange={12}
      renderItem={renderItem}
      renderEmptyDate={emptyItem}
      rowHasChanged={(r1, r2) => {
        return r1.id !== r2.id;
      }}
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
