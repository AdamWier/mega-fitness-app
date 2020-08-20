import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CalendarList } from 'react-native-calendars';
import { withTheme, Text } from 'react-native-elements';
import { View, StyleSheet, Alert } from 'react-native';

function WeekSelector({
  theme,
  period,
  setPeriod,
  shouldConfirm,
}): JSX.Element {
  const onDayPress = async (date: { [key: string]: any }) => {
    if (shouldConfirm) {
      return Alert.alert(
        'Confirm',
        'Do you want to change weeks without saving?',
        [
          { text: 'Cancel', onPress: () => null },
          { text: 'OK', onPress: () => createNewWeek(date) },
        ]
      );
    }
    return createNewWeek(date);
  };

  const createNewWeek = (date: { [key: string]: any }) => {
    const currentMoment = moment(date.dateString);
    const beginningOfWeek = moment(currentMoment.startOf('isoWeek'));
    const week = {
      [beginningOfWeek.format('YYYY-MM-DD')]: {
        startingDay: true,
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('1', 'day').format('YYYY-MM-DD')]: {
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('2', 'day').format('YYYY-MM-DD')]: {
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('3', 'day').format('YYYY-MM-DD')]: {
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('4', 'day').format('YYYY-MM-DD')]: {
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('5', 'day').format('YYYY-MM-DD')]: {
        color: theme.colors.success,
      },
      [beginningOfWeek.clone().add('6', 'day').format('YYYY-MM-DD')]: {
        endingDay: true,
        color: theme.colors.success,
      },
    };
    setPeriod(week);
  };

  return (
    <View style={style.calendarContainer}>
      <Text h4>Select a week</Text>
      <CalendarList
        markedDates={period}
        markingType={'period'}
        onDayPress={onDayPress}
        firstDay={1}
        hideDayNames
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          dayTextColor: theme.colors.text,
          monthTextColor: theme.colors.text,
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  calendarContainer: {
    flex: 0.5,
  },
});

WeekSelector.propTypes = {
  period: PropTypes.objectOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool]))
  ),
  setPeriod: PropTypes.func.isRequired,
  shouldConfirm: PropTypes.bool,
};

WeekSelector.defaultProps = {
  shouldConfirm: false,
};

export default withTheme(WeekSelector);
