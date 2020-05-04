import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import { navTheme } from '../StyleSheet';
import StackScreenCreator from './StackScreenCreator';
import screens from './Screens';
import { container } from '../store/reducers/User';
import { authService } from '../Firebase';
import { Button, Icon } from 'react-native-elements';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

function Navigation({ user, storeLogin }): JSX.Element {
  const Screens = StackScreenCreator(Stack, screens, !!user.uid);

  React.useEffect(() => {
    const userCheck = authService.checkIfLoggedIn();
    if (!user && userCheck) {
      storeLogin(userCheck);
    }
  }, [user, storeLogin]);

  const logout = () => {
    Alert.alert('Log out', 'Do you want to log out?', [
      { text: 'No', onPress: () => null },
      {
        text: 'Yes',
        onPress: () => {
          authService.logout();
          storeLogin({ uid: null, email: null });
        },
      },
    ]);
  };

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
          headerRight: () =>
            !!user.uid && (
              <Button
                icon={<Icon name={'power-settings-new'} />}
                onPress={logout}
              />
            ),
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
