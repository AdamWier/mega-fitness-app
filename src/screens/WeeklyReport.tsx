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
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryAxis,
} from 'victory-native';
import { ScrollView } from 'react-native-gesture-handler';

const createMealReport = (
  mealDocuments: { [key: string]: any },
  dayDocuments: { [key: string]: any }
) => {
  const mealsGroupedByDay = mealDocuments.reduce((accum, next) => {
    const dayString = moment(next.eatenAt).startOf('day').format('dddd');
    if (accum.hasOwnProperty(dayString)) {
      accum[dayString].push(...next.meal);
    } else {
      accum[dayString] = [...next.meal];
    }
    return accum;
  }, {});

  const mealTotalsByDay = {};
  for (const day in mealsGroupedByDay) {
    mealTotalsByDay[day] = mealsGroupedByDay[day].reduce(
      (accum, next) => accum + next.calories,
      0
    );
  }

  const dayDocumentsRegrouped = dayDocuments.reduce((accum, next) => {
    const dayString = moment(next.date).startOf('day').format('dddd');
    accum[dayString] = next.goalCalories;
    return accum;
  }, {});

  const days = [
    ...new Set([
      ...Object.keys(mealsGroupedByDay),
      ...Object.keys(dayDocumentsRegrouped),
    ]),
  ];

  const graphData = days.map((day) => ({
    day,
    eaten: mealTotalsByDay[day] || 0,
    goal: dayDocumentsRegrouped[day] || 0,
  }));

  const meals = mealDocuments.flatMap(
    (document: { [key: string]: any }) => document.meal
  );

  const totals = meals.reduce(
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

  return { totals, graphData };
};

function WeeklyReport({ user, theme }): JSX.Element {
  const [period, setPeriod] = useState({});
  const [report, setReport] = useState({});

  const axisStyle = {
    grid: { stroke: null },
    ticks: { size: 0 },
  };

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
    setReport(createMealReport(mealDocuments, dayDocuments));
  };

  return (
    <View style={style.content}>
      <CustomHeader />
      <View style={style.calendarContainer}>
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
          <VictoryChart animate theme={VictoryTheme.material}>
            <VictoryAxis style={axisStyle} />
            <VictoryAxis dependentAxis style={axisStyle} />
            <VictoryGroup offset={20} colorScale={'qualitative'}>
              <VictoryBar
                data={report.graphData}
                x="day"
                y="eaten"
                labels={({ datum }) => (datum.eaten ? 'eaten' : '')}
              />
              <VictoryBar
                data={report.graphData}
                x="day"
                y="goal"
                labels={({ datum }) => (datum.goal ? 'goal' : '')}
              />
            </VictoryGroup>
          </VictoryChart>
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
    flex: 3,
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
