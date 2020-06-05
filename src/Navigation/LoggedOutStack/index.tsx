import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navTheme } from '../../StyleSheet';
import screens from './Screens';

const Stack = createStackNavigator();

export default function Navigation(): JSX.Element {
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
