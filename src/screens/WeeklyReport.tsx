import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserContainerProps } from '../store/reducers/User';
import CustomHeader from '../components/CustomHeader';
import moment from 'moment';
import { mealDocumentService, dayDocumentService } from '../Firebase/index';
import FoodCard from '../components/FoodCard';
import { ScrollView } from 'react-native-gesture-handler';
import { createWeeklyReport } from '../utilities';
import WeeklyGoalChart from '../components/WeeklyGoalsChart';
import WeekSelector from '../components/WeekSelector';

function WeeklyReport({ user }: UserContainerProps) {
  const [period, setPeriod] = useState({});
  const [report, setReport] = useState({
    graphData: [] as ReturnType<typeof createWeeklyReport>['graphData'],
    averages: { calories: 0, protein: 0, fats: 0, carbs: 0 },
  });

  useEffect(() => {
    (async function getReport() {
      if (!user.uid) return;
      const mealDocuments = await mealDocumentService.findByWeek(
        moment(Object.keys(period)[0]).toDate(),
        user.uid
      );
      const dayDocuments = await dayDocumentService.findByWeek(
        moment(Object.keys(period)[0]).toDate(),
        user.uid
      );
      setReport(createWeeklyReport(mealDocuments, dayDocuments));
    })();
  }, [period, user.uid]);

  return (
    <View style={style.content}>
      <CustomHeader title="Weekly reports" />
      <WeekSelector
        period={period}
        setPeriod={setPeriod}
        shouldConfirm={false}
      />
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
});

export default container(WeeklyReport);
