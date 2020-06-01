import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import GoalPrompt from '../components/GoalPrompt';

function Settings({ user, storeLogin }): JSX.Element {
  const [goalCalories, setGoalCalories] = useState('0');

  const saveCalories = () => console.log(null);

  return (
    <View style={style.content}>
      <View style={style.equalSpace}>
        <Text h2>User Settings For</Text>
        <Text h4>{user.email}</Text>
      </View>
      <View style={style.equalSpace}>
        <GoalPrompt 
          goalCalories={goalCalories} 
          setGoalCalories={setGoalCalories} 
          onConfirmButtonPress={saveCalories} 
          loading={false} 
        />
      </View>
      <View style={style.equalSpace}/>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'space-evenly',
    flex: 1
  },
  equalSpace: {
    flex: 1
  }
});

Settings.propTypes = {
  user: PropTypes.shape({ uid: PropTypes.string, email: PropTypes.string }).isRequired,
  storeLogin: PropTypes.func.isRequired,
};

export default container(Settings);
