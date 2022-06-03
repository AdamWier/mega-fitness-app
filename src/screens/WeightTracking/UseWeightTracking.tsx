import { dayDocumentService } from '@/Firebase';
import DayDocument from '@/Firebase/Documents/DayDocument';
import { UserContainerProps } from '@/store/reducers/User';
import { useDebounceCallback } from '@react-hook/debounce';
import { useCallback, useEffect, useState } from 'react';
import { createDataPoints, WeightReport } from './createDataPoints';

export const useWeightTracking = (user: UserContainerProps['user']) => {
  const [isLoading, toggleIsLoading] = useState(true);
  const [weightReport, setWeightReport] = useState<WeightReport | undefined>();

  const createDataPointsCallback = useCallback(createDataPoints, []);

  const loadDataPoints = async (beginningOfMonth: Date) => {
    toggleIsLoading(true);
    const records = (
      user.uid
        ? await dayDocumentService.findLastThiryDays(beginningOfMonth, user.uid)
        : []
    ) as DayDocument[];
    setWeightReport(
      records.length ? createDataPointsCallback(records) : undefined
    );
    toggleIsLoading(false);
  };

  const getWeights = useDebounceCallback(
    useCallback(loadDataPoints, [
      setWeightReport,
      createDataPointsCallback,
      user.uid,
    ]),
    500
  );

  useEffect(() => {
    getWeights(new Date());
  }, [getWeights]);

  return {
    isLoading,
    weightReport,
    getWeights,
  };
};
