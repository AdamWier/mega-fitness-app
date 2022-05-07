import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';

jest.mock('react-native-simple-toast', () => ({
  SHORT: 'SHORT',
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('<App />', () => {
  it('has 1 child', () => {
    expect.assertions(1);
    const tree = renderer
      .create(<App />)
      .toJSON() as renderer.ReactTestRendererJSON;
    expect(tree.children?.length).toBe(1);
  });

  it('renders correctly', () => {
    expect.assertions(1);
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
