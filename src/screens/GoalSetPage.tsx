import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import GoalPrompt from '../components/GoalPrompt';
import Toast from 'react-native-simple-toast';
import { userDocumentService } from '../Firebase';
import CustomHeader from '../components/Header';

function GoalSetPage({ user }): JSX.Element {
  const [isLoading, toggleIsLoading] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');

  const checkIsNumber = async () => {
    const goalCaloriesNumber = Number(goalCaloriesInput);
    if (!goalCaloriesNumber || Number.isNaN(goalCaloriesNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      try {
        toggleIsLoading(true);
        await userDocumentService.updateCalorieGoal(
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
      <CustomHeader title="Calorie goal" />
      <View style={style.equalSpace}>
        <Text h2>Set calorie goal for</Text>
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
    flex: 1,
  },
  equalSpace: {
    flex: 1,
  },
});

GoalSetPage.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};

export default container(GoalSetPage);
