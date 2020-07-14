import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';

function WeightGraph({ records }): JSX.Element {
  const axisStyle = {
    grid: { stroke: null },
    ticks: { size: 0 },
  } as any;

  return (
    records.length > 2 && (
      <VictoryChart animate theme={VictoryTheme.material}>
        <VictoryAxis style={axisStyle} />
        <VictoryAxis dependentAxis style={axisStyle} />
        <VictoryLine
          data={records.length > 2 ? records : null}
          domain={{ y: [0, 120] }}
        />
      </VictoryChart>
    )
  );
}

WeightGraph.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({ date: PropTypes.string, weight: PropTypes.number })
  ).isRequired,
};

export default WeightGraph;
