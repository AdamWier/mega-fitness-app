import React from 'react';
import { Card, Text, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';
import moment from 'moment';

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
        onPress={() => onMealPress(document)}
        activeOpacity={0.5}
      >
        <View>
          <Text h4 style={styles.text}>
            {document.name || 'Untitled'}
          </Text>
          <Text style={styles.text}>
            {`${document.meal.reduce(getTotalCalories, 0)} Calories`}
          </Text>
          <Text style={styles.text}>
            {moment(document.eatenAt).format('H:mm')}
          </Text>
        </View>
      </TouchableOpacity>
      <Button
        onPress={() => onDeletePress(document.id)}
        buttonStyle={{
          backgroundColor: theme.colors.danger,
        }}
        containerStyle={styles.buttonContainer}
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
  text: { textAlign: 'left' },
  buttonContainer: {
    flexBasis: '30%',
    margin: 0,
  },
});

export default withTheme(AgendaItem);
