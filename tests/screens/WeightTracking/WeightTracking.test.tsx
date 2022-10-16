import * as React from 'react';
import WeightTracking from '@/screens/WeightTracking/WeightTracking';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
  
    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};
  
    return Reanimated;
  });

  jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: jest.fn(),
        dispatch: jest.fn(),
      }),
    };
  });

describe('<WeightTracking />', () => {



  it('has 5 children', () => {
    expect.assertions(1);
    const configureMockStore = configureStore();
    const store = configureMockStore({
        user: {
            uid: 1
        }
    })
    const tree = renderer
      .create(
        <Provider store={store}>
        <WeightTracking />
        </Provider>
      )
      .toJSON() as renderer.ReactTestRendererJSON;
    expect(tree.children?.length).toBe(5);
  });

  it(`renders correctly`, () => {
      jest.mock('@/Firebase', () => ({
          dayDocumentService: {
            findLastThiryDays: () => [
                {
                    id: 1,
                    date: new Date(2021, 6, 4).getTime(),
                    weight: 80,
                },
                {
                    id: 2,
                    date: new Date(2021, 6, 5).getTime(),
                    weight: 79.5,
                },
                {
                    id: 3,
                    date: new Date(2021, 6, 6).getTime(),
                    weight: 90,
                },
                {
                    id: 4,
                    date: new Date(2021, 6, 7).getTime(),
                    weight: 79.7,
                },
                {
                    id: 5,
                    date: new Date(2021, 6, 8).getTime(),
                    weight: 78,
                },
            ]
          }
      }))
      const configureMockStore = configureStore();
      const store = configureMockStore({
          user: {
              uid: 1
          }
      })
    expect.assertions(1);
    const tree = renderer.create(
        <Provider store={store}>
          {/* <NavigationContainer> */}
          <WeightTracking />
      {/* </NavigationContainer> */}
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });
});
