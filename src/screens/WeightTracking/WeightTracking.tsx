import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ActivityIndicator from '../../components/ActivityIndicator';
import { container, UserContainerProps } from '../../store/reducers/User';
import CustomHeader from '../../components/CustomHeader';
import { dayDocumentService } from '../../Firebase/index';
import WeightGraph from './components/WeightGraph';
import { Text } from 'react-native-elements';
import { useEffect } from 'react';
import DayDocument from '../../Firebase/Documents/DayDocument';
import { createDataPoints, WeightReport } from './WeightTrackerLogic';
import { useDebounceCallback } from '@react-hook/debounce';

function WeightTracking({ user }: UserContainerProps) {
  const [isLoading, toggleIsLoading] = useState(true);

  const [weightReport, setWeightReport] = useState<WeightReport | undefined>();

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
        setWeightReport(
          records.length ? createDataPointsCallback(records) : undefined
        );
        toggleIsLoading(false);
      },
      [setWeightReport, createDataPointsCallback, user.uid]
    ),
    500
  );

  useEffect(() => {
    getWeights(new Date());
  }, [getWeights]);

  return (
    <View>
      <CustomHeader title="Weight tracking" />
      <Text style={styles.explanation}>Slide right to see past dates</Text>
      <View style={styles.reportHeader}>
        <View>
          <Text style={styles.weights}>Max weight</Text>
          <Text style={styles.weights}>{weightReport?.maxWeight ?? '-'}</Text>
        </View>
        <View>
          <Text style={styles.weights}>Average weight</Text>
          <Text style={styles.weights}>
            {weightReport?.averageWeight ?? '-'}
          </Text>
        </View>
        <View>
          <Text style={styles.weights}>Min weight</Text>
          <Text style={styles.weights}>{weightReport?.minWeight ?? '-'}</Text>
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
    marginVertical: 30,
  },
  weights: {
    fontSize: 20,
  },
  explanation: {
    marginVertical: 10,
  },
});

export default container(WeightTracking);
