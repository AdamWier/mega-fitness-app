import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';

function WeightGraph({ weightReport }): JSX.Element {
  const axisStyle = {
    grid: { stroke: null },
    ticks: { size: 0 },
  } as any;

  return (
    weightReport.records.length > 2 && (
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
    )
  );
}

WeightGraph.propTypes = {
  weightReport: PropTypes.shape({
    records: PropTypes.arrayOf(
      PropTypes.shape({ date: PropTypes.string, weight: PropTypes.number })
    ).isRequired,
    minWeight: PropTypes.number,
    maxWeight: PropTypes.number,
  }),
};

export default WeightGraph;
