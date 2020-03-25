import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements';
import {theme, navTheme} from './StyleSheet';
import Search from './screens/Search';
import Details from './screens/Details';
import Day from './screens/Day';

const Stack = createStackNavigator();

function App() {
  const [meal, updateMeal] = React.useState([]);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#375a7f',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerTintColor: 'rgba(255, 255, 255, 0.6)',
        }}>
          <Stack.Screen name='Day'>
            {props => <Day {...props} meal={meal} />}
          </Stack.Screen>
          <Stack.Screen name='Search' component={Search} />
          <Stack.Screen name='Details' 
            options={({ route }) => ({ 
              title: route.params.details.name, 
            })}>
            {props => <Details {...props} meal={meal} updateMeal={updateMeal} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;