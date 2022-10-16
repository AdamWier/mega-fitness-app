import { findMax, findMin } from '@/utilities';
import moment from 'moment';
import { useState } from 'react';
import { DomainPropType, DomainTuple } from 'victory';
import { WeightReport } from '../createDataPoints';

export type Domain = { x: DomainTuple; y: DomainTuple };

export const useWeightGraph = (weightReport: WeightReport) => {
  const nowTime = new Date().getTime();

  const minDate = weightReport.records
    .map(({ x }) => x)
    .concat(Infinity)
    .reduce(findMin);

  const yDomain: DomainTuple = weightReport.records.length
    ? [
        Math.floor(weightReport.minWeight * 0.95),
        Math.floor(weightReport.maxWeight * 1.05),
      ]
    : [50, 120];

  const initalZoomDomains: Record<string, Record<'x' | 'y', DomainTuple>> = {
    true: {
      x: [
        minDate,
        (weightReport?.records || [])
          .map(({ x }) => x)
          .concat(0)
          .reduce(findMax),
      ],
      y: yDomain,
    },
    false: {
      x: [moment(new Date()).subtract(14, 'days').valueOf(), nowTime],
      y: yDomain,
    },
  };

  const [zoomDomain, setZoomDomain] = useState<Domain>(
    initalZoomDomains[(!!weightReport.records.length).toString()]
  );

  const applicableDate = (minDate: number) =>
    Number.isNaN(minDate) && !isFinite(minDate);

  const domain: DomainPropType = {
    x: [
      moment(applicableDate(minDate) ? minDate : nowTime)
        .subtract(360, 'days')
        .valueOf(),
      nowTime,
    ],
    y: yDomain,
  };

  return {
    zoomDomain,
    setZoomDomain,
    domain,
    yDomain,
  };
};
