import React, { useState, useEffect } from 'react';
import { Text, Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import WeekSelector from '../components/WeekSelector';
import { mealDocumentService } from '../Firebase';
import moment from 'moment';
import UpDownButtons from '../components/UpDownButtons';

function ShoppingList({ user }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [list, setList] = useState([]);

  const updateList = (food: string, portion: string, updatedNumber: string) => {
    const newFood = list[food];
    newFood[portion] = updatedNumber;
    setList((list) => ({ ...list, [food]: newFood }));
  };

  useEffect(() => {
    (async function generateList() {
      const mealDocuments = await mealDocumentService.findByWeek(
        moment(Object.keys(period)[0]).toDate(),
        user.uid
      );
      const foods = mealDocuments.flatMap((document) => document.meal);
      const reorderedFoods = foods.reduce((accumulator, currentValue) => {
        if (accumulator.hasOwnProperty(currentValue.name)) {
          accumulator[currentValue.name][
            currentValue.portionDescription
          ] += Number(currentValue.amount);
        } else {
          accumulator[currentValue.name] = {
            [currentValue.portionDescription]: Number(currentValue.amount),
          };
        }
        return accumulator;
      }, {});
      setList(reorderedFoods);
    })();
  }, [period, user.uid]);

  return (
    <View style={style.content}>
      <CustomHeader title="Shopping Lists" />
      <View style={style.calendarContainer}>
        <Text h4>Select a week</Text>
        <WeekSelector period={period} setPeriod={setPeriod} />
      </View>
      <ScrollView style={style.listSpace}>
        <Card title="Shopping list">
          {Object.keys(list).map((food) =>
            Object.keys(list[food]).map((portion) => (
              <View>
                <Text key={food + portion} style={style.listItem}>
                  {food}
                </Text>
                <View style={style.subItem}>
                  <UpDownButtons
                    total={list[food][portion]}
                    onValueChange={(updatedNumber: string) =>
                      updateList(food, portion, updatedNumber)
                    }
                  />
                  <Text>
                    {list[food][portion]} {portion}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
  listSpace: {
    flex: 1,
  },
  listItem: {
    textAlign: 'left',
    fontSize: 20,
  },
  subItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  calendarContainer: {
    flex: 0.5,
  },
});

ShoppingList.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};

export default container(ShoppingList);
