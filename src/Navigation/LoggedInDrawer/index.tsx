import * as React from 'react';
import screens from './Screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navTheme } from '../../StyleSheet';

const Drawer = createDrawerNavigator();

export default function LoggedInDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerContentStyle: {
          backgroundColor: navTheme.colors.background,
        },
        drawerLabelStyle: {
          color: navTheme.colors.text,
        },
      }}
    >
      {screens.map((screen, index) => (
        <Drawer.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options}
          key={index}
        />
      ))}
    </Drawer.Navigator>
  );
}
