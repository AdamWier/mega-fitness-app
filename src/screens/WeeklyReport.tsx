import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import moment from 'moment';
import { CalendarList } from 'react-native-calendars';
import { withTheme } from 'react-native-elements';
import { mealDocumentService, dayDocumentService } from '../Firebase/index';
import FoodCard from '../components/FoodCard';
import { ScrollView } from 'react-native-gesture-handler';
import { createWeeklyReport } from '../utilities';
import WeeklyGoalChart from '../components/WeeklyGoalsChart';

function WeeklyReport({ user, theme }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [report, setReport] = useState({});

  const onDayPress = async (date: { [key: string]: any }) => {
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
    const mealDocuments = await mealDocumentService.findByWeek(
      beginningOfWeek.toDate(),
      user.uid
    );
    const dayDocuments = await dayDocumentService.findByWeek(
      beginningOfWeek.toDate(),
      user.uid
    );
    setReport(createWeeklyReport(mealDocuments, dayDocuments));
  };

  return (
    <View style={style.content}>
      <CustomHeader />
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
      <ScrollView style={style.reportSpace}>
        {!!report.totals?.calories && (
          <FoodCard
            name="Weekly Average"
            calories={report.totals.calories.toString()}
            protein={report.totals.protein.toString()}
            fats={report.totals.fats.toString()}
            carbs={report.totals.carbs.toString()}
            expanded
          />
        )}
        {!!report.graphData?.length && (
          <WeeklyGoalChart graphData={report.graphData} />
        )}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
  reportSpace: {
    flex: 1,
  },
  calendarContainer: {
    flex: 0.5,
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
