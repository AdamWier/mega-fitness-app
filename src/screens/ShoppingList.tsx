import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import WeekSelector from '../components/WeekSelector';
import { mealDocumentService } from '../Firebase';
import moment from 'moment';

function ShoppingList({ user }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [list, setList] = useState([]);

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
        {Object.keys(list).map((food) =>
          Object.keys(list[food]).map((portion) => (
            <Text
              key={food + portion}
            >{`${food}: ${portion} ${list[food][portion]}`}</Text>
          ))
        )}
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
  calendarContainer: {
    flex: 1,
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
