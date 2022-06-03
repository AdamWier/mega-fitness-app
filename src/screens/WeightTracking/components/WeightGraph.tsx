import moment from 'moment';
import React from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory-native';
import { VictoryAxisCommonProps } from 'victory-core';
import { WeightReport } from '../WeightTrackerLogic';
import { useWeightGraph } from './UseWeightGraph';

function WeightGraph({ weightReport, getWeights }: WeightGraphProps) {
  const emptyReport = {
    records: [],
    minWeight: 0,
    maxWeight: 0,
    averageWeight: 0,
  };
  const { zoomDomain, setZoomDomain, domain, yDomain } = useWeightGraph(
    weightReport || emptyReport
  );
  const axisStyle: VictoryAxisCommonProps['style'] = {
    grid: { stroke: 0 },
    ticks: { display: 'none' },
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
        data={weightReport?.records}
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
