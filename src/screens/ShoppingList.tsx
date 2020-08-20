import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserPropTypes } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import WeekSelector from '../components/WeekSelector';
import { mealDocumentService, shoppingListDocumentService } from '../Firebase';
import moment from 'moment';
import ShoppingListCard from '../components/ShoppingListCard';

function ShoppingList({ user }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [list, setList] = useState({ id: null, items: {} });

  const updateAmount = (
    food: string,
    portion: string,
    updatedNumber: string
  ) => {
    const newFood = list.items[food];
    newFood[portion].amount = updatedNumber;
    setList((previousList) => ({ ...previousList, [food]: newFood }));
  };

  const toggleCheckBox = (
    food: string,
    portion: string,
    isChecked: boolean
  ) => {
    const newFood = list.items[food];
    newFood[portion].checked = !isChecked;
    setList((previousList) => ({ ...previousList, [food]: newFood }));
  };

  const saveList = async () => {
    if (list.id) {
      shoppingListDocumentService.updateShoppingList(
        new Date(Object.keys(period)[0]),
        list,
        user.uid
      );
    } else {
      const id = await shoppingListDocumentService.createShoppingList(
        new Date(Object.keys(period)[0]),
        list,
        user.uid
      );
      setList((list) => ({
        ...list,
        id,
      }));
    }
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
    setList({ items: reorderedFoods, id: null });
  }, [period, user.uid]);

  useEffect(() => {
    (async function findOrGenerateList() {
      const weekDays = Object.keys(period);
      const savedList =
        weekDays.length &&
        (await shoppingListDocumentService.findDocument(
          new Date(weekDays[0]),
          user.uid
        ));
      savedList ? setList(savedList) : generateList();
    })();
  }, [generateList, period, user.uid]);

  return (
    <View style={style.content}>
      <CustomHeader title="Shopping Lists" />
      <WeekSelector
        period={period}
        setPeriod={setPeriod}
        shouldConfirm={!!Object.keys(list.items).length}
      />
      <ScrollView style={style.listSpace}>
        {!!Object.keys(list.items).length && (
          <ShoppingListCard
            list={list.items}
            updateAmount={updateAmount}
            toggleCheckBox={toggleCheckBox}
            refreshList={generateList}
            saveList={saveList}
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
