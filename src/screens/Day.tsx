import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';
import { container as UserContainer } from '../store/reducers/User';
import { container as MealContainer } from '../store/reducers/MealDocument';
import { firestoreService } from '../Firebase';
import MealDocument from '../Firebase/Documents/MealDocument';
import { Agenda } from 'react-native-calendars';
import AgendaItem from '../components/AgendaItem';

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

function Day({
  navigation,
  route,
  theme,
  user,
  updateMealDocument,
}): JSX.Element {
  const currentDate: Date = route.params.date || new Date();

  const title = `${
    months[currentDate.getMonth()]
  } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  navigation.setOptions({ title });

  const [agendaItems, setAgendaItems] = useState({});

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

  const reduceMealDocuments = (data: { [key: string]: any }[]) => {
    const items = data.reduce((agenda, item) => {
      const { eatenAt } = item;
      const year = eatenAt.getFullYear();
      const month = ('0' + (eatenAt.getMonth() + 1).toString()).slice(-2);
      const day = eatenAt.getDate();
      const key = `${year}-${month}-${day}`;
      if (agenda.hasOwnProperty(key)) {
        agenda[key].push(item);
      } else agenda[key] = [item];
      return agenda;
    }, {});
    setAgendaItems(items);
  };

  useEffect(() => {
    (async function (): Promise<void> {
      const data = await firestoreService.findMealsByDate(
        currentDate,
        user.uid
      );
      if (data) {
        reduceMealDocuments(data);
      }
    })();
  }, [currentDate, user.uid]);

  const renderItem = (document) => {
    return (
      <AgendaItem
        document={document}
        onMealPress={handleMealPress}
        onDeletePress={confirmDelete}
      />
    );
  };

  return (
    <Agenda
      items={agendaItems}
      onDayPress={() => {
        console.log('day pressed');
      }}
      onDayChange={() => {
        console.log('day changed');
      }}
      pastScrollRange={12}
      futureScrollRange={12}
      renderItem={renderItem}
      renderEmptyDate={() => {
        return <View />;
      }}
      rowHasChanged={(r1, r2) => {
        console.log({ r1, r2 });
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
