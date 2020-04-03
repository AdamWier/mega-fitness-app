import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

export default function AccountCreation(): JSX.Element {

  const [signUpDetails, setSignUpDetails] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
  })

  const updateSignUpDetails = (value: string, field: string): void => {
    setSignUpDetails(state =>({
      ...state,
      [field]: value,
    }));
  };

  const createAcount = (): any => {
    console.log(signUpDetails);
  };

  return (
    <View style={style.content}>
      <Text>Create an account</Text>
      <Input 
        placeholder="Username" 
        onChangeText={
          (value): void => updateSignUpDetails(value, 'username')
        }
      />
      <Input 
        placeholder="Password" 
        secureTextEntry
        onChangeText={
          (value): void => updateSignUpDetails(value, 'password')
        }
      />
      <Input 
        placeholder="Confirm password" 
        secureTextEntry 
        onChangeText={
          (value): void => updateSignUpDetails(value, 'passwordConfirmation')
        }
      />
      <Button 
        title="Create account" 
        onPress={createAcount}
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
