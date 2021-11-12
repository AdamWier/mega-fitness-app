import React from 'react';
import { View } from 'react-native';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';

function WeightGraph({ weightReport }: WeightGraphProps) {
  const axisStyle = {
    grid: { stroke: null },
    ticks: { size: 0 },
  } as any;

  return weightReport.records.length > 2 ? (
    <VictoryChart animate theme={VictoryTheme.material}>
      <VictoryAxis style={axisStyle} />
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
