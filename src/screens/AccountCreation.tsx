import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { authService } from '../Firebase';
import { container } from '../store/reducers/User';
import { UserDocument } from '../Firebase/Documents/UserDocument';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FoodJournalStackParams,
  FoodJournalStackScreenNames,
} from '../Navigation/FoodJournalStack/Screens';

function AccountCreation({ navigation, storeLogin }: AccountCreationProps) {
  const [signUpDetails, setSignUpDetails] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [isLoading, toggleLoading] = useState(false);

  const [errors, updateErrors] = useState<string[]>([]);

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
        navigation.navigate(FoodJournalStackScreenNames.FoodJournal);
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
          updateSignUpDetails(value, 'passwordConfirmation')
        }
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

interface AccountCreationProps {
  navigation: StackNavigationProp<
    FoodJournalStackParams,
    FoodJournalStackScreenNames.FoodJournal
  >;
  storeLogin: (user: Partial<UserDocument>) => void;
}

export default container(AccountCreation);
