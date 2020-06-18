import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import { navTheme } from '../../StyleSheet';
import screens from './Screens';
import { container } from '../../store/reducers/User';
import { authService } from '../../Firebase';
import { Button, Icon } from 'react-native-elements';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

function Navigation({ storeLogin, navigation }): JSX.Element {
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
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.colors.primary,
        },
        headerTitleStyle: {
          color: navTheme.colors.text,
        },
        headerTintColor: navTheme.colors.text,
        headerLeft: () => (
          <Button
            icon={<Icon name={'menu'} />}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerRight: () => (
          <Button
            icon={<Icon name={'power-settings-new'} />}
            onPress={logout}
          />
        ),
      }}
    >
      {screens.map((screen, index) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
}

Navigation.propTypes = {
  storeLogin: PropTypes.func.isRequired,
};

export default container(Navigation);
