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

const createKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const reduceMealDocuments = (data: { [key: string]: any }[]) => {
  return data.reduce((agenda, item) => {
    const { eatenAt } = item;
    const key = createKey(eatenAt);
    if (agenda.hasOwnProperty(key)) {
      agenda[key].push(item);
    } else agenda[key] = [item];
    return agenda;
  }, {});
};

function AgendaPage({
  navigation,
  theme,
  user,
  updateMealDocument,
}): JSX.Element {
  const [agendaItems, setAgendaItems] = useState();

  const [currentDate, setCurrentDate] = useState(new Date());

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

  const onDayPress = useCallback(
    async (date: Date) => {
      setCurrentDate(date);
      const documents = await firestoreService.findMealsByDate(date, user.uid);
      if (documents) {
        setAllFoods(documents.flatMap((document) => document.meal));
        setAgendaItems(reduceMealDocuments(documents));
      } else {
        setAgendaItems({
          [createKey(date)]: [],
        });
      }
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
          eatenAt: currentDate,
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
      onDayPress={(date) => onDayPress(new Date(date.timestamp))}
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
