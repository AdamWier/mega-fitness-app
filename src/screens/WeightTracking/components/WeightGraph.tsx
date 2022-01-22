import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { VictoryZoomContainerProps } from 'victory';
import { VictoryAxisCommonProps } from 'victory-core';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory-native';
import {
  calculateAverage,
  findMax,
  findMin,
  WeightReport,
} from '../WeightTrackerLogic';

function WeightGraph({ weightReport, getWeights }: WeightGraphProps) {
  const axisStyle: VictoryAxisCommonProps['style'] = {
    grid: { stroke: 0 },
    ticks: { display: 'none' },
  };

  const zoomDomain: VictoryZoomContainerProps['zoomDomain'] = weightReport
    .records.length
    ? {
        x: [
          weightReport.records.map(({ x }) => x).reduce(calculateAverage),
          weightReport.records
            .map(({ x }) => x)
            .concat(0)
            .reduce(findMax),
        ],
      }
    : { x: [0, 0] };

  return weightReport.records.length > 2 ? (
    <VictoryChart
      animate
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={zoomDomain}
          onZoomDomainChange={(value) => {
            getWeights(moment(new Date(value.x[0])).subtract(5, 'd').toDate());
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
        data={weightReport.records}
        domain={{
          x: [
            weightReport.records
              .map(({ x }) => x)
              .concat(Infinity)
              .reduce(findMin),
            weightReport.records
              .map(({ x }) => x)
              .concat(0)
              .reduce(findMax),
          ],
          y: [
            Math.floor(weightReport.minWeight * 0.9),
            Math.floor(weightReport.maxWeight * 1.1),
          ],
        }}
      />
    </VictoryChart>
  ) : (
    <View />
  );
}

interface WeightGraphProps {
  weightReport: WeightReport;
  getWeights: (date: Date) => void;
}

export default WeightGraph;
