import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserPropTypes } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { mealDocumentService, shoppingListDocumentService } from '../Firebase';
import ShoppingListCard from '../components/ShoppingListCard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Text, Icon, Button } from 'react-native-elements';

function ShoppingList({ user }): JSX.Element {
  const [period, setPeriod] = useState({
    start: null as Date,
    end: null as Date,
  });
  const [list, setList] = useState({ id: null, items: {} });
  const [isStartVisible, setIsStartVisible] = useState(false);
  const [isEndVisible, setIsEndVisible] = useState(false);

  const getEnd = (start: Date) => {
    setPeriod((period) => ({
      ...period,
      start: moment(start).startOf('day').toDate(),
      end: null,
    }));
    setIsStartVisible(false);
    setIsEndVisible(true);
  };

  const getPeriod = (end: Date) => {
    setPeriod((period) => ({
      ...period,
      end: moment(end).startOf('day').toDate(),
    }));
    setIsEndVisible(false);
  };

  const updateAmount = (
    food: string,
    portion: string,
    updatedNumber: string | null
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
      shoppingListDocumentService.updateShoppingList(list, user.uid);
    } else {
      const id = await shoppingListDocumentService.createShoppingList(
        period.start,
        period.end,
        list,
        user.uid
      );
      setList((list) => ({
        ...list,
        id,
      }));
    }
  };

  const generateList = useCallback(
    async (id: string | null) => {
      const mealDocuments = await mealDocumentService.findByDateRange(
        period.start,
        period.end,
        user.uid
      );
      const foods = mealDocuments.flatMap((document) => document.meal);
      const reorderedFoods = foods.reduce((accumulator, currentValue) => {
        if (accumulator.hasOwnProperty(currentValue.name)) {
          if (
            accumulator[currentValue.name].hasOwnProperty[
              currentValue.portionDescription
            ]
          ) {
            accumulator[currentValue.name][
              currentValue.portionDescription
            ].amount += Number(currentValue.amount);
          } else {
            accumulator[currentValue.name][currentValue.portionDescription] = {
              amount: Number(currentValue.amount),
              checked: false,
            };
          }
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
      setList({ items: reorderedFoods, id });
    },
    [period.start, period.end, user.uid]
  );

  useEffect(() => {
    setIsStartVisible(true);
  }, [setIsStartVisible]);

  useEffect(() => {
    (async function findOrGenerateList() {
      if (period.start && period.end) {
        const savedList = await shoppingListDocumentService.findDocument(
          period.start,
          period.end,
          user.uid
        );
        savedList ? setList(savedList) : generateList(null);
      }
    })();
  }, [generateList, period, user.uid]);

  return (
    <View style={style.content}>
      <CustomHeader title="Shopping Lists" />
      <DateTimePickerModal
        isVisible={isStartVisible}
        date={period.start || new Date()}
        mode="date"
        onConfirm={getEnd}
        onCancel={() => null}
      />
      <DateTimePickerModal
        isVisible={isEndVisible}
        date={period.end || new Date()}
        mode="date"
        onConfirm={getPeriod}
        onCancel={() => null}
      />
      <View style={style.horizontal}>
        <Text h4>
          {!!period.start && `${period.start?.toLocaleDateString()} - `}
          {period.end?.toLocaleDateString()}
        </Text>
        <Button
          icon={<Icon name="restore" />}
          onPress={() => setIsStartVisible(true)}
        />
      </View>
      <ScrollView style={style.listSpace}>
        {!!period.start &&
          !!period.end &&
          (Object.keys(list.items).length ? (
            <ShoppingListCard
              list={list.items}
              updateAmount={updateAmount}
              toggleCheckBox={toggleCheckBox}
              refreshList={() => generateList(list.id)}
              saveList={saveList}
            />
          ) : (
            <Text>No meals or list found</Text>
          ))}
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
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

ShoppingList.propTypes = {
  ...UserPropTypes,
};

export default container(ShoppingList);
