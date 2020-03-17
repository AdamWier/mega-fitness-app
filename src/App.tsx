import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './screens/Search';
import Details from './screens/Details';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#375a7f',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerTintColor: 'rgba(255, 255, 255, 0.6)',
      }}>
        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='Details' component={Details} 
          options={({ route }) => ({ 
            title: route.params.details.name, 
          })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;