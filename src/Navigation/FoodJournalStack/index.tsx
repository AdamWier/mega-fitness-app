import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navTheme } from '../../StyleSheet';
import screens from './Screens';
import CustomHeader from '../../components/CustomHeader';

const Stack = createStackNavigator();

function Navigation(): JSX.Element {
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
        header: () => <CustomHeader title="Calorie goal" />,
      }}
    >
      {screens.map((screen, index) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options as any}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
}

export default Navigation;
