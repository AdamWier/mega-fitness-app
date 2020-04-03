import React from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

export default function AccountCreation(): JSX.Element {
  return (
    <View style={style.content}>
      <Text>Create an account</Text>
      <Input placeholder="Username" />
      <Input placeholder="Password" />
      <Input placeholder="Confirm password" />
      <Button title="Create account" />
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
