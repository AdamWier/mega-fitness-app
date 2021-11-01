import React, { useState } from 'react';
import { Text, Input, Button, withTheme } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { authService } from '../Firebase';
import { container } from '../store/reducers/User';
import { MyTheme } from '../StyleSheet';
import { UserDocument } from '../Firebase/Documents/UserDocument';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  LoggedOutStackParams,
  LoggedOutStackScreenNames,
} from '../Navigation/LoggedOutStack/Screens';

function Login({ navigation, storeLogin, theme }: LoginProps) {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [isLoading, toggleLoading] = useState(false);
  const [error, updateError] = useState('');

  const updateLoginDetails = (value: string, field: string): void => {
    setLoginDetails((state) => ({
      ...state,
      [field]: value,
    }));
  };

  const login = async (): Promise<void> => {
    toggleLoading(true);
    const { email, password } = loginDetails;
    if (!email || !password) {
      toggleLoading(false);
      return updateError('Please enter your email and password.');
    }

    try {
      const user = await authService.login(email, password);
      storeLogin(user);
      toggleLoading(false);
    } catch ({ message }) {
      toggleLoading(false);
      updateError(message);
    }
  };

  return (
    <View style={style.content}>
      {!error ? <Text h1>Login</Text> : <Text>{error}</Text>}
      <Input
        placeholder="Email"
        onChangeText={(value): void => updateLoginDetails(value, 'email')}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={(value): void => updateLoginDetails(value, 'password')}
      />
      <Button
        title="Login"
        onPress={login}
        loading={isLoading}
        disabled={isLoading}
      />
      <Button
        title="Create an account"
        onPress={(): void => {
          navigation.navigate(LoggedOutStackScreenNames.AccountCreation);
        }}
        buttonStyle={{
          backgroundColor: theme.colors.info,
        }}
        containerStyle={{
          margin: 25,
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

interface LoginProps {
  navigation: StackNavigationProp<
    LoggedOutStackParams,
    LoggedOutStackScreenNames.Login
  >;
  storeLogin: (info: Partial<UserDocument>) => void;
  theme: MyTheme;
}

export default container(withTheme(Login));
