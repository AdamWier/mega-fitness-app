import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import GoalPrompt from '../components/GoalPrompt';
import Toast from 'react-native-simple-toast';
import { firestoreService } from '../Firebase';

function Settings({ user }): JSX.Element {
  const [isLoading, toggleIsLoading] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');

  const checkIsNumber = async () => {
    const goalCaloriesNumber = Number(goalCaloriesInput);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        toggleIsLoading(true);
        await firestoreService.updateUserCalorieGoal(
          user.uid,
          goalCaloriesNumber
        );
        setGoalCaloriesInput(goalCaloriesNumber.toString());
        toggleIsLoading(false);
      } catch (e) {
        Toast.showWithGravity(
          "Your goal couldn't be saved",
          Toast.SHORT,
          Toast.CENTER
        );
      }
    }
  };

  useEffect(() => {
    if (user.goalCalories) {
      setGoalCaloriesInput(user.goalCalories.toString());
    }
  }, [user]);

  return (
    <View style={style.content}>
      <View style={style.equalSpace}>
        <Text h2>User Settings For</Text>
        <Text h4>{user.email}</Text>
      </View>
      <View style={style.equalSpace}>
        <GoalPrompt
          goalCalories={goalCaloriesInput}
          setGoalCalories={setGoalCaloriesInput}
          onConfirmButtonPress={checkIsNumber}
          loading={isLoading}
        />
      </View>
      <View style={style.equalSpace} />
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'space-evenly',
    flex: 1,
  },
  equalSpace: {
    flex: 1,
  },
});

Settings.propTypes = {
  user: PropTypes.shape({ uid: PropTypes.string, email: PropTypes.string })
    .isRequired,
};

export default container(Settings);
