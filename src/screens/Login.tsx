import React, { useState } from 'react';
import { Text, Input, Button, withTheme } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { authService } from '../Firebase';
import { container } from '../store/reducers/User';

function Login({ navigation, storeLogin, theme }): JSX.Element {
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
    if (email && password) {
      try {
        const user = await authService.login(email, password);
        storeLogin(user);
      } catch ({ message }) {
        toggleLoading(false);
        updateError(message);
      }
    } else {
      toggleLoading(false);
      updateError('Please enter your email and password.');
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
          navigation.navigate('Account Creation');
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

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  storeLogin: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
};

export default container(withTheme(Login));
