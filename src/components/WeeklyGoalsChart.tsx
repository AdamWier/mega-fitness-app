import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryGroup,
  VictoryBar,
} from 'victory-native';

function WeeklyGoalChart({ graphData }): JSX.Element {
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

WeeklyGoalChart.propTypes = {
  graphData: PropTypes.array.isRequired,
};

export default WeeklyGoalChart;
