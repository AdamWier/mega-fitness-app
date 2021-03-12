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
  const [isVisible, setIsVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);

  const getPeriod = (input: Date) => {
    setIsVisible(false);
    if (!period.start) {
      setPeriod((oldPeriod) => ({
        ...oldPeriod,
        start: moment(input).startOf('day').toDate(),
        end: null,
      }));
    } else if (!period.end) {
      setPeriod((oldPeriod) => ({
        ...oldPeriod,
        end: moment(input).startOf('day').toDate(),
      }));
    }
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
      setList((oldList) => ({
        ...oldList,
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
      const reorderedFoods = foods.reduce(
        (accumulator, { name, amount, portionDescription }) => {
          if (accumulator.hasOwnProperty(name)) {
            if (accumulator[name].hasOwnProperty(portionDescription)) {
              accumulator[name][portionDescription].amount += Number(amount);
            } else {
              accumulator[name][portionDescription] = {
                amount: Number(amount),
                checked: false,
              };
            }
          } else {
            accumulator[name] = {
              [portionDescription]: {
                amount: Number(amount),
                checked: false,
              },
            };
          }
          return accumulator;
        },
        {}
      );
      setList({ items: reorderedFoods, id });
    },
    [period.start, period.end, user.uid]
  );

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
  }, [generateList, period.start, period.end, user.uid]);

  return (
    <View style={style.content}>
      <CustomHeader title="Shopping Lists" />
      <DateTimePickerModal
        isVisible={isVisible}
        date={currentInput || new Date()}
        mode="date"
        onChange={setCurrentInput}
        onConfirm={getPeriod}
        onCancel={() => setIsVisible(false)}
      />
      <View style={style.horizontal}>
        <Button
          icon={<Icon name="restore" />}
          onPress={() => {
            setPeriod((oldPeriod) => ({
              ...oldPeriod,
              start: null,
            }));
            setIsVisible(true);
          }}
        />
        <Text h4>
          {period.start ? period.start?.toLocaleDateString() : 'Enter start'}-
          {period.end ? period.end?.toLocaleDateString() : 'Enter end'}
        </Text>
        <Button
          icon={<Icon name="restore" />}
          onPress={() => {
            setPeriod((oldPeriod) => ({
              ...oldPeriod,
              end: null,
            }));
            setIsVisible(true);
          }}
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
