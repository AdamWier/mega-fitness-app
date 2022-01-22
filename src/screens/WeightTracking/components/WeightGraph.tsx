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

function WeightGraph({ weightReport }: WeightGraphProps) {
  const axisStyle: VictoryAxisCommonProps['style'] = {
    grid: { stroke: 0 },
    ticks: { display: 'none' },
  };

  const zoomDomain: VictoryZoomContainerProps['zoomDomain'] = {
    x: [
      moment(new Date()).subtract(7, 'days').toDate().getTime(),
      new Date().getTime(),
    ],
  };

  return weightReport.records.length > 2 ? (
    <VictoryChart
      animate
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={zoomDomain}
          onZoomDomainChange={(value: any) => console.log(value)}
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
  weightReport: Record<string, any>;
}

export default WeightGraph;
