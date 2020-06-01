import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { authService } from '../Firebase';
import { container } from '../store/reducers/User';

function Settings({ user, navigation, storeLogin }): JSX.Element {
  return (
    <View style={style.content}>
      <Text h2>User Settings For</Text>
      <Text h4>{user.email}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    paddingTop: StatusBar.currentHeight,
  },
});

// Settings.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func.isRequired,
//   }).isRequired,
//   storeLogin: PropTypes.func.isRequired,
// };

export default container(Settings);
