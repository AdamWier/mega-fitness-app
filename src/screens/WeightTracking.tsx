import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserContainerProps } from '../store/reducers/User';
import CustomHeader from '../components/CustomHeader';
import moment from 'moment';
import { dayDocumentService } from '../Firebase/index';
import MonthPicker from '../components/MonthPicker';
import WeightGraph from '../components/WeightGraph';
import { Text } from 'react-native-elements';
import { useEffect } from 'react';
import DayDocument from '../Firebase/Documents/DayDocument';
import { useMemo } from 'react';

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
  const currentMonth = useMemo(
    () => (moment().month() + 1).toString().padStart(2, '0'),
    []
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [weightReport, setWeightReport] = useState<WeightReport>({
    averageWeight: 0,
    maxWeight: 0,
    minWeight: 0,
    records: [],
  });

  const findMax = (past: number, current: number) => Math.max(past, current);

  const findMin = (past: number, current: number) => Math.min(past, current);

  const calculateAverage = (
    accumulator: number,
    currentValue: number,
    index: number,
    array: number[]
  ) =>
    index === array.length - 1
      ? Math.round(((currentValue + accumulator) / array.length) * 10) / 10
      : accumulator + currentValue;

  const createDataPoints = useCallback((records: DayDocument[]) => {
    const weights = records
      .map((record) => record.weight)
      .filter((weight): weight is number => !!weight);

    return {
      records: adaptRecordsForGraph(records),
      minWeight: weights.reduce(findMin),
      maxWeight: weights.reduce(findMax),
      averageWeight: weights.reduce(calculateAverage),
    };
  }, []);

  const getWeights = useCallback(
    async (beginningOfMonth: Date) => {
      const records = user.uid
        ? await dayDocumentService.findByMonth(beginningOfMonth, user.uid)
        : [];
      console.log(records);
      setWeightReport(createDataPoints(records as DayDocument[]));
    },
    [setWeightReport, createDataPoints, user.uid]
  );

  useEffect(() => {
    getWeights(moment(`2022-${selectedMonth}-01`).toDate());
  }, [getWeights, selectedMonth]);

  const adaptRecordsForGraph = (records: DayDocument[]) =>
    records
      .filter((record) => record.weight)
      .map(({ date, weight }) => ({
        x: date.getTime(),
        y: weight,
      }));

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
