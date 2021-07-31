import React from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryGroup,
  VictoryBar,
} from 'victory-native';
import { createWeeklyReport } from '../utilities';

function WeeklyGoalChart({ graphData }: WeeklyGoalChartProps): JSX.Element {
  const axisStyle = {
    grid: { stroke: null },
    ticks: { size: 0 },
  } as any;

  return (
    <VictoryChart animate theme={VictoryTheme.material}>
      <VictoryAxis style={axisStyle} />
      <VictoryAxis dependentAxis style={axisStyle} />
      <VictoryGroup offset={20} colorScale={'qualitative'}>
        <VictoryBar
          data={graphData}
          x="day"
          y="eaten"
          labels={({ datum }) => (datum.eaten ? 'eaten' : '')}
        />
        <VictoryBar
          data={graphData}
          x="day"
          y="goal"
          labels={({ datum }) => (datum.goal ? 'goal' : '')}
        />
      </VictoryGroup>
    </VictoryChart>
  );
}

interface WeeklyGoalChartProps {
  graphData: ReturnType<typeof createWeeklyReport>['graphData'];
}

export default WeeklyGoalChart;
