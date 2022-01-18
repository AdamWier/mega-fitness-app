import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { container, UserContainerProps } from '../store/reducers/User';
import CustomHeader from '../components/CustomHeader';
import moment from 'moment';
import { dayDocumentService } from '../Firebase/index';
import MonthPicker from '../components/MonthPicker';
import WeightGraph from '../components/WeightGraph';
import { Text } from 'react-native-elements';

interface Record {
  x: string;
  y: any;
}
const emptyReport = {
  records: [] as Record[],
  minWeight: null,
  maxWeight: null,
  averageWeight: null,
};

function WeightTracking({ user }: UserContainerProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weightReport, setWeightReport] = useState(emptyReport);

  const onValueChange = async (value: string) => {
    setSelectedMonth(value);
    if (value) {
      const beginningOfMonth = moment(`2022-${value}-01`).toDate();
      const records = user.uid
        ? await dayDocumentService.findByMonth(beginningOfMonth, user.uid)
        : [];
      if (records.length) {
        const weights = records
          .filter((record) => !!record.weight)
          .map((record) => record.weight);
        const maxWeight =
          weights.reduce(
            (accumulator, currentValue) => Math.max(accumulator, currentValue),
            0
          ) || null;
        const minWeight = maxWeight
          ? weights.reduce((accumulator, currentValue) =>
              Math.min(accumulator, currentValue)
            )
          : null;
        const averageWeight =
          weights.reduce(
            (accumulator, currentValue, index, array) =>
              index === array.length - 1
                ? Math.round(
                    ((currentValue + accumulator) / array.length) * 10
                  ) / 10
                : accumulator + currentValue,
            0
          ) || null;
        setWeightReport({
          records: adaptRecordsForGraph(records),
          minWeight,
          maxWeight,
          averageWeight,
        });
      } else {
        setWeightReport(emptyReport);
      }
    } else {
      setWeightReport(emptyReport);
    }
  };

  const adaptRecordsForGraph = (records: { [key: string]: any }[]) =>
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
        onValueChange={onValueChange}
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
