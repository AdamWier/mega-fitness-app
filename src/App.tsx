import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements';
import {theme, navTheme} from './StyleSheet';
import Search from './screens/Search';
import Details from './screens/Details';
import Day from './screens/Day';
import Navigation from './Navigation';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation/>
    </ThemeProvider>
  );
}

export default App;