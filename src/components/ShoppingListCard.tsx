import React from 'react';
import { Card, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import UpDownButtons from './UpDownButtons';

export default function ShoppingListCard({ list, updateList }): JSX.Element {
  return (
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
  );
}

ShoppingListCard.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.objectOf(PropTypes.oneOf([PropTypes.string, PropTypes.bool]))
    )
  ).isRequired,
  updateList: PropTypes.func.isRequired,
};

const style = StyleSheet.create({
  listItem: {
    textAlign: 'left',
    fontSize: 20,
  },
  subItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
