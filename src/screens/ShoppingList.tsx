import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserPropTypes } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import WeekSelector from '../components/WeekSelector';
import { mealDocumentService } from '../Firebase';
import moment from 'moment';
import ShoppingListCard from '../components/ShoppingListCard';

function ShoppingList({ user }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [list, setList] = useState({});

  const updateAmount = (
    food: string,
    portion: string,
    updatedNumber: string
  ) => {
    const newFood = list[food];
    newFood[portion].amount = updatedNumber;
    setList((previousList) => ({ ...previousList, [food]: newFood }));
  };

  const toggleCheckBox = (
    food: string,
    portion: string,
    isChecked: boolean
  ) => {
    const newFood = list[food];
    newFood[portion].checked = !isChecked;
    setList((previousList) => ({ ...previousList, [food]: newFood }));
  };

  const generateList = useCallback(async () => {
    const mealDocuments = await mealDocumentService.findByWeek(
      moment(Object.keys(period)[0]).toDate(),
      user.uid
    );
    const foods = mealDocuments.flatMap((document) => document.meal);
    const reorderedFoods = foods.reduce((accumulator, currentValue) => {
      if (accumulator.hasOwnProperty(currentValue.name)) {
        accumulator[currentValue.name][
          currentValue.portionDescription
        ].amount += Number(currentValue.amount);
      } else {
        accumulator[currentValue.name] = {
          [currentValue.portionDescription]: {
            amount: Number(currentValue.amount),
            checked: false,
          },
        };
      }
      return accumulator;
    }, {});
    setList(reorderedFoods);
  }, [period, user.uid]);

  useEffect(() => {
    generateList();
  }, [generateList]);

  return (
    <View style={style.content}>
      <CustomHeader title="Shopping Lists" />
      <WeekSelector period={period} setPeriod={setPeriod} />
      <ScrollView style={style.listSpace}>
        {!!Object.keys(list).length && (
          <ShoppingListCard
            list={list}
            updateAmount={updateAmount}
            toggleCheckBox={toggleCheckBox}
            refreshList={generateList}
          />
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
});

ShoppingList.propTypes = {
  ...UserPropTypes,
};

export default container(ShoppingList);
