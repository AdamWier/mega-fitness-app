import moment from 'moment';
import React, { useState } from 'react';
import { DomainPropType, DomainTuple } from 'victory';
import { VictoryAxisCommonProps } from 'victory-core';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory-native';
import { findMax, findMin, WeightReport } from '../WeightTrackerLogic';

function WeightGraph({ weightReport, getWeights }: WeightGraphProps) {
  const applicableRecords = weightReport?.records || [];
  type Domain = { x: DomainTuple; y: DomainTuple };

  const nowTime = new Date().getTime();
  const minDate = applicableRecords
    .map(({ x }) => x)
    .concat(Infinity)
    .reduce(findMin);
  const applicableDate = Number.isNaN(minDate) && !isFinite(minDate);
  const yDomain: DomainTuple = weightReport
    ? [
        Math.floor(weightReport.minWeight * 0.95),
        Math.floor(weightReport.maxWeight * 1.05),
      ]
    : [50, 120];

  const initalZoomDomains: Record<string, Domain> = {
    true: {
      x: [
        minDate,
        applicableRecords
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
    initalZoomDomains[(!!applicableRecords.length).toString()]
  );

  const axisStyle: VictoryAxisCommonProps['style'] = {
    grid: { stroke: 0 },
    ticks: { display: 'none' },
  };

  const domain: DomainPropType = {
    x: [
      moment(applicableDate ? minDate : nowTime)
        .subtract(360, 'days')
        .valueOf(),
      nowTime,
    ],
    y: yDomain,
  };

  return (
    <VictoryChart
      animate
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={zoomDomain}
          onZoomDomainChange={({ x }) => {
            setZoomDomain({ x, y: yDomain });
            getWeights(new Date(x[1]));
          }}
          allowZoom={false}
        />
      }
    >
      <VictoryAxis
        style={axisStyle}
        tickFormat={(x) => moment(new Date(x)).format('MMM D')}
      />
      <VictoryAxis dependentAxis style={axisStyle} />
      <VictoryLine
        data={applicableRecords}
        domain={domain}
        labels={({ datum }) => datum.y}
      />
    </VictoryChart>
  );
}

interface WeightGraphProps {
  weightReport: WeightReport | undefined;
  getWeights: (date: Date) => void;
}

export default WeightGraph;
