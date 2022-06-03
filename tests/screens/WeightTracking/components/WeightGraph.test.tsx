import * as React from 'react';
import WeightGraph from '@/screens/WeightTracking/components/WeightGraph';
import renderer from 'react-test-renderer';

describe('<WeightGraph />', () => {
  const weightReport = {
    averageWeight: 79.6,
    maxWeight: 81,
    minWeight: 77,
    records: [
      {
        x: new Date(2021, 6, 4).getTime(),
        y: 79.5,
      },
      {
        x: new Date(2021, 6, 5).getTime(),
        y: 81,
      },
      {
        x: new Date(2021, 6, 6).getTime(),
        y: 80.6,
      },
      {
        x: new Date(2021, 6, 7).getTime(),
        y: 77,
      },
      {
        x: new Date(2021, 6, 8).getTime(),
        y: 80,
      },
    ],
  };

  it('has 2 children', () => {
    expect.assertions(1);
    const tree = renderer
      .create(
        <WeightGraph getWeights={jest.fn()} weightReport={weightReport} />
      )
      .toJSON() as renderer.ReactTestRendererJSON;
    expect(tree.children?.length).toBe(2);
  });

  it(`renders correctly`, () => {
    expect.assertions(1);
    const tree = renderer.create(
      <WeightGraph getWeights={jest.fn()} weightReport={weightReport} />
    );
    expect(tree).toMatchSnapshot();
  });
});
