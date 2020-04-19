import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import { navTheme } from '../StyleSheet';
import StackScreenCreator from './StackScreenCreator';
import screens from './Screens';
import { container } from '../store/reducers/User';
import { authService } from '../Firebase';

const Stack = createStackNavigator();

function Navigation({ user, storeLogin }): JSX.Element {
  // Seems functional but probably still needs to be tested
  const Screens = StackScreenCreator(Stack, screens, !!user.uid);

  React.useEffect(() => {
    const userCheck = authService.checkIfLoggedIn();
    if (!user && userCheck) {
      storeLogin(userCheck);
    }
  }, [user, storeLogin]);

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
        {Screens}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  storeLogin: PropTypes.func.isRequired,
};

export default container(Navigation);
