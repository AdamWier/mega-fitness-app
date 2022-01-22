import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserContainerProps } from '../../store/reducers/User';
import CustomHeader from '../../components/CustomHeader';
import moment from 'moment';
import { dayDocumentService } from '../../Firebase/index';
import MonthPicker from './components/MonthPicker';
import WeightGraph from './components/WeightGraph';
import { Text } from 'react-native-elements';
import { useEffect } from 'react';
import DayDocument from '../../Firebase/Documents/DayDocument';
import { createDataPoints } from './WeightTrackerLogic';

interface DataPoint {
  x: number;
  y: number | undefined;
}

interface WeightReport {
  records: DataPoint[];
  minWeight: number;
  maxWeight: number;
  averageWeight: number;
}

function WeightTracking({ user }: UserContainerProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    (moment().month() + 1).toString().padStart(2, '0')
  );

  const [weightReport, setWeightReport] = useState<WeightReport>({
    averageWeight: 0,
    maxWeight: 0,
    minWeight: 0,
    records: [],
  });

  const createDataPointsCallback = useCallback(createDataPoints, []);

  const getWeights = useCallback(
    async (beginningOfMonth: Date) => {
      const records = (
        user.uid
          ? await dayDocumentService.findByMonth(beginningOfMonth, user.uid)
          : []
      ) as DayDocument[];
      setWeightReport(createDataPointsCallback(records));
    },
    [setWeightReport, createDataPointsCallback, user.uid]
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
      <WeightGraph weightReport={weightReport} />
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
