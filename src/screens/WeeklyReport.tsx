import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import moment from 'moment';
import {CalendarList} from 'react-native-calendars';
import { withTheme } from 'react-native-elements';

function WeeklyReport({ user, theme }): JSX.Element {
  const [period, setPeriod] = useState({})

  const onDayPress = (date) => {
    const currentMoment = moment(date.dateString);
    const beginningOfWeek = moment(currentMoment.startOf('isoWeek'));
    const week = {
      [beginningOfWeek.format('YYYY-MM-DD')]: {startingDay: true, color: theme.colors.success},
      [beginningOfWeek.clone().add('1', 'day').format('YYYY-MM-DD')]: {color: theme.colors.success},
      [beginningOfWeek.clone().add('2', 'day').format('YYYY-MM-DD')]: {color: theme.colors.success},
      [beginningOfWeek.clone().add('3', 'day').format('YYYY-MM-DD')]: {color: theme.colors.success},
      [beginningOfWeek.clone().add('4', 'day').format('YYYY-MM-DD')]: {color: theme.colors.success},
      [beginningOfWeek.clone().add('5', 'day').format('YYYY-MM-DD')]: {color: theme.colors.success},
      [beginningOfWeek.clone().add('6', 'day').format('YYYY-MM-DD')]: {endingDay: true, color: theme.colors.success}
    }
    setPeriod(week);
  }


  return (
    <View style={style.content}>
      <CustomHeader />
      <View style={style.equalSpace}>
        <Text h2>Select a week</Text>
        <CalendarList
          markedDates={period}
          markingType={"period"}
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
      <View style={style.equalSpace}>
      </View>
      <View style={style.equalSpace} />
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
  equalSpace: {
    flex: 1,
  },
});

WeeklyReport.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};

export default withTheme(container(WeeklyReport));
