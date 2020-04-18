import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { authService } from '../Firebase';
import { container } from '../store/reducers/User';

function AccountCreation({ navigation, storeLogin }): JSX.Element {
  const [signUpDetails, setSignUpDetails] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [isLoading, toggleLoading] = useState(false);

  const [errors, updateErrors] = useState([]);

  const updateSignUpDetails = (value: string, field: string): void => {
    setSignUpDetails((state) => ({
      ...state,
      [field]: value,
    }));
  };

  const createAcount = async (): Promise<void> => {
    toggleLoading(true);
    const errorsMessages = authService.checkUserDetails(signUpDetails);
    if (errorsMessages.length) {
      toggleLoading(false);
      updateErrors(errorsMessages);
    } else {
      try {
        const user = await authService.createUser(
          signUpDetails.email,
          signUpDetails.password
        );
        storeLogin(user);
        navigation.navigate('Calendar');
      } catch (message) {
        toggleLoading(false);
        updateErrors([message]);
      }
    }
  };

  return (
    <View style={style.content}>
      {!errors.length ? (
        <Text h1>Create an account</Text>
      ) : (
        errors.map((error) => <Text key={error}>{error}</Text>)
      )}
      <Input
        placeholder="Email"
        onChangeText={(value): void => updateSignUpDetails(value, 'email')}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={(value): void => updateSignUpDetails(value, 'password')}
      />
      <Input
        placeholder="Confirm password"
        secureTextEntry
        onChangeText={(value): void =>
          /* prettier-ignore */
          updateSignUpDetails(value, 'passwordConfirmation')}
      />
      <Button
        title="Create account"
        onPress={createAcount}
        loading={isLoading}
        disabled={isLoading}
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

AccountCreation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  storeLogin: PropTypes.func.isRequired,
};

export default container(AccountCreation);
