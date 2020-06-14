import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import moment from 'moment';
import { CalendarList } from 'react-native-calendars';
import { withTheme } from 'react-native-elements';
import { mealDocumentService } from '../Firebase/index';
import FoodCard from '../components/FoodCard';

const createMealReport = (mealDocuments: { [key: string]: any }) => {
  const meals = mealDocuments.flatMap(
    (document: { [key: string]: any }) => document.meal
  );

  return meals.reduce(
    (
      accum: { [key: string]: number },
      next: { [key: string]: number },
      index: number
    ) => {
      accum.calories += next.calories;
      accum.protein += next.protein;
      accum.carbs += next.carbs;
      accum.fats += next.fats;
      if (index === meals.length - 1) {
        accum.calories /= meals.length;
        accum.protein /= meals.length;
        accum.carbs /= meals.length;
        accum.fats /= meals.length;
      }
      return accum;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

function WeeklyReport({ user, theme }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [report, setReport] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
  });

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
    const generatedReport = createMealReport(mealDocuments);
    setReport(generatedReport);
  };

  return (
    <View style={style.content}>
      <CustomHeader />
      <View style={style.equalSpace}>
        <Text h2>Select a week</Text>
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
      <View style={style.equalSpace}>
        {report.calories ? (
          <View>
            <FoodCard
              name="Weekly Average"
              calories={report.calories.toString()}
              protein={report.protein.toString()}
              fats={report.fats.toString()}
              carbs={report.carbs.toString()}
              expanded
            />
          </View>
        ) : null}
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
