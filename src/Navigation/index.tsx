import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navTheme } from '../StyleSheet';
import StackScreenCreator from './StackScreenCreator'
import screens from './Screens';

const Stack = createStackNavigator();

export default function Navigation(){
    return(
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: navTheme.colors.primary,
                },
                headerTitleStyle: {
                    color: navTheme.colors.text,
                },
                headerTintColor: navTheme.colors.text,
            }}>
                {StackScreenCreator(Stack, screens)}
            </Stack.Navigator>
        </NavigationContainer>
    )
};