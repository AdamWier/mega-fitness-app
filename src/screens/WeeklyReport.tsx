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
  const [startOfPeriod, setStartOfPeriod] = useState(null);
  const [period, setPeriod] = useState({});
  const [report, setReport] = useState({
    graphData: [],
    averages: { calories: 0, protein: 0, fats: 0, carbs: 0 },
  });

  const onDayPress = async (date: { [key: string]: any }) => {
    const currentMoment = moment(date.dateString);
    if (
      !startOfPeriod ||
      currentMoment.isBefore(startOfPeriod) ||
      currentMoment.clone().diff(startOfPeriod, 'months') >= 1
    ) {
      setStartOfPeriod(currentMoment);
      setPeriod({
        [currentMoment.clone().format('YYYY-MM-DD')]: {
          startingDay: true,
          color: theme.colors.success,
        },
      });
    } else if (currentMoment.isAfter(startOfPeriod)) {
      const period = {};
      const length = currentMoment.clone().diff(startOfPeriod, 'days');
      for (let i = length; i >= 0; i--) {
        period[
          currentMoment.clone().subtract(i, 'day').format('YYYY-MM-DD')
        ] = {
          startingDay: i === length,
          endingDay: i === 0,
          color: theme.colors.success,
        };
      }
      setPeriod(period);
      const mealDocuments = await mealDocumentService.findByPeriod(
        startOfPeriod.startOf('day').toDate(),
        currentMoment.endOf('day').toDate(),
        user.uid
      );
      const dayDocuments = await dayDocumentService.findByPeriod(
        startOfPeriod.startOf('day').toDate(),
        currentMoment.endOf('day').toDate(),
        user.uid
      );
      setReport(createWeeklyReport(mealDocuments, dayDocuments));
    }
  };

  return (
    <View style={style.content}>
      <CustomHeader title="Weekly reports" />
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
        {!!report.averages.calories && (
          <FoodCard
            name="Weekly Average"
            calories={report.averages.calories.toString()}
            protein={report.averages.protein.toString()}
            fats={report.averages.fats.toString()}
            carbs={report.averages.carbs.toString()}
            expanded
          />
        )}
        {!!report.graphData.length && (
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
