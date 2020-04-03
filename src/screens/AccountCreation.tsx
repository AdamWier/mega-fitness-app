import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { authService } from '../Firebase';

export default function AccountCreation({ navigation }): JSX.Element {
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
    const errorsMessages = await authService.createUser(signUpDetails);
    if (errorsMessages.length) {
      updateErrors(errorsMessages);
    } else navigation.navigate('Search');
  };

  return (
    <View style={style.content}>
      {!errors.length ? (
        <Text>Create an account</Text>
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
          // prettier-ignore
          updateSignUpDetails(value, 'passwordConfirmation')}
      />
      <Button
        title="Create account"
        onPress={createAcount}
        loading={isLoading}
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
};
