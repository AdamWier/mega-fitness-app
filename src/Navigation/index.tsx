import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import { navTheme } from '../StyleSheet';
import StackScreenCreator from './StackScreenCreator';
import screens from './Screens';
import { container } from '../store/reducers/User';

const Stack = createStackNavigator();

function Navigation({ user }): JSX.Element {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: navTheme.colors.primary,
          },
          headerTitleStyle: {
            color: navTheme.colors.text,
          },
          headerTintColor: navTheme.colors.text,
        }}
      >
        {StackScreenCreator(Stack, screens, !!user.uid)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default container(Navigation);
