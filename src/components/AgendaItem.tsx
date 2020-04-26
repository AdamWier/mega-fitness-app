import React from 'react';
import { Card, Text, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';

const getTimeString = (time: Date): string => {
  const fullString = time.toLocaleTimeString();
  return fullString.substring(0, fullString.length - 3);
};

const getTotalCalories = (
  accumulator: number,
  currentValue: { [key: string]: any }
): number => accumulator + currentValue.calories;

const AgendaItem = ({ document, onMealPress, onDeletePress, theme }) => (
  <Card key={document.id}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <TouchableOpacity
        style={{
          flexBasis: '70%',
          margin: 0,
          padding: -10,
        }}
        onPress={() => onMealPress(document)}
        activeOpacity={0.5}
      >
        <View>
          <Text h4 style={styles.textStyle}>
            {document.name || 'Untitled'}
          </Text>
          <Text style={styles.textStyle}>
            {`${document.meal.reduce(getTotalCalories, 0)} Calories`}
          </Text>
          <Text style={styles.textStyle}>
            {getTimeString(document.eatenAt)}
          </Text>
        </View>
      </TouchableOpacity>
      <Button
        onPress={() => onDeletePress(document.id)}
        buttonStyle={{
          backgroundColor: theme.colors.danger,
        }}
        containerStyle={{
          flexBasis: '30%',
          margin: 0,
        }}
        icon={<Icon name="delete" />}
      />
    </View>
  </Card>
);

AgendaItem.propTypes = {
  document: PropTypes.object.isRequired,
  onMealPress: PropTypes.func.isRequired,
  onDeletePress: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  textStyle: { textAlign: 'left' },
});

export default withTheme(AgendaItem);
