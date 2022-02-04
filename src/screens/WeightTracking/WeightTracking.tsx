import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ActivityIndicator from '../../components/ActivityIndicator';
import { container, UserContainerProps } from '../../store/reducers/User';
import CustomHeader from '../../components/CustomHeader';
import moment from 'moment';
import { dayDocumentService } from '../../Firebase/index';
import MonthPicker from './components/MonthPicker';
import WeightGraph from './components/WeightGraph';
import { Text } from 'react-native-elements';
import { useEffect } from 'react';
import DayDocument from '../../Firebase/Documents/DayDocument';
import { createDataPoints, WeightReport } from './WeightTrackerLogic';
import { useDebounceCallback } from '@react-hook/debounce';

function WeightTracking({ user }: UserContainerProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    (moment().month() + 1).toString().padStart(2, '0')
  );
  const [isLoading, toggleIsLoading] = useState(true);

  const [weightReport, setWeightReport] = useState<WeightReport>({
    averageWeight: 0,
    maxWeight: 0,
    minWeight: 0,
    records: [],
  });

  const createDataPointsCallback = useCallback(createDataPoints, []);

  const getWeights = useDebounceCallback(
    useCallback(
      async (beginningOfMonth: Date) => {
        toggleIsLoading(true);
        const records = (
          user.uid
            ? await dayDocumentService.findLastThiryDays(
                beginningOfMonth,
                user.uid
              )
            : []
        ) as DayDocument[];
        records.length > 2 &&
          setWeightReport(createDataPointsCallback(records));
        toggleIsLoading(false);
      },
      [setWeightReport, createDataPointsCallback, user.uid]
    ),
    500
  );

  useEffect(() => {
    getWeights(moment(`2022-${selectedMonth}-01`).toDate());
  }, [getWeights, selectedMonth]);

  return (
    <View>
      <CustomHeader title="Weight tracking" />
      <MonthPicker
        onValueChange={setSelectedMonth}
        selectedMonth={selectedMonth}
      />
      <View style={styles.reportHeader}>
        <View>
          <Text style={styles.weights}>Max weight</Text>
          <Text style={styles.weights}>{weightReport.maxWeight}</Text>
        </View>
        <View>
          <Text style={styles.weights}>Average weight</Text>
          <Text style={styles.weights}>{weightReport.averageWeight}</Text>
        </View>
        <View>
          <Text style={styles.weights}>Min weight</Text>
          <Text style={styles.weights}>{weightReport.minWeight}</Text>
        </View>
      </View>
      <WeightGraph weightReport={weightReport} getWeights={getWeights} />
      {isLoading && <ActivityIndicator size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weights: {
    fontSize: 20,
  },
});

export default container(WeightTracking);
