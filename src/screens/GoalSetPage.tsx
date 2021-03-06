import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { container, UserPropTypes } from '../store/reducers/User';
import GoalPrompt from '../components/GoalPrompt';
import Toast from 'react-native-simple-toast';
import { userDocumentService } from '../Firebase';
import CustomHeader from '../components/Header';
import { UserDocument } from '../Firebase/Documents/UserDocument';

function GoalSetPage({ user, storeCalories, storeWaterGoal }): JSX.Element {
  const [isCalorieLoading, toggleIsCalorieLoading] = useState(false);
  const [isWaterLoading, toggleIsWaterLoading] = useState(false);
  const [goalCaloriesInput, setGoalCaloriesInput] = useState('0');
  const [goalWaterInput, setGoalWaterInput] = useState('0');

  const processGoal = (
    goalInput: string,
    setGoal: (number: number) => void
  ) => {
    const goalInputNumber = Number(goalInput);
    if (!goalInputNumber || Number.isNaN(goalInputNumber)) {
      Toast.showWithGravity('Please enter a number', Toast.SHORT, Toast.CENTER);
    } else {
      setGoal(goalInputNumber);
    }
  };

  const setWaterGoal = async (goal: number) => {
    try {
      toggleIsWaterLoading(true);
      await userDocumentService.updateWaterGoal(user.uid, goal);
      setGoalWaterInput(goal.toString());
      toggleIsWaterLoading(false);
    } catch (e) {
      Toast.showWithGravity(
        "Your water goal couldn't be saved",
        Toast.SHORT,
        Toast.CENTER
      );
    }
  };

  const setCalorieGoal = async (goal: number): Promise<void> => {
    try {
      toggleIsCalorieLoading(true);
      await userDocumentService.updateCalorieGoal(user.uid, goal);
      setGoalCaloriesInput(goal.toString());
      toggleIsCalorieLoading(false);
    } catch (e) {
      Toast.showWithGravity(
        "Your calorie goal couldn't be saved",
        Toast.SHORT,
        Toast.CENTER
      );
    }
  };

  useEffect(() => {
    user.goalCalories && setGoalCaloriesInput(user.goalCalories.toString());
    user.waterGoal && setGoalWaterInput(user.waterGoal.toString());

    const unsubscribeUserListener = userDocumentService.getDocumentListener(
      user.uid,
      (userDocument: UserDocument) => {
        storeWaterGoal(userDocument.waterGoal);
        storeCalories(userDocument.goalCalories);
      }
    );
    return () => {
      unsubscribeUserListener();
    };
  }, [
    user.uid,
    user.goalCalories,
    user.waterGoal,
    storeCalories,
    storeWaterGoal,
  ]);

  return (
    <View style={style.content}>
      <CustomHeader title="Calorie goal" />
      <Text h2>Goals for</Text>
      <Text h4>{user.email}</Text>
      <GoalPrompt
        goal={goalCaloriesInput}
        setGoal={setGoalCaloriesInput}
        onConfirmButtonPress={() =>
          processGoal(goalCaloriesInput, setCalorieGoal)
        }
        loading={isCalorieLoading}
        clearGoal={() => setCalorieGoal(0)}
        title="Daily calorie goal"
      />
      <GoalPrompt
        goal={goalWaterInput}
        setGoal={setGoalWaterInput}
        onConfirmButtonPress={() => processGoal(goalWaterInput, setWaterGoal)}
        loading={isWaterLoading}
        clearGoal={() => setWaterGoal(0)}
        title="Daily water goal"
      />
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
});

GoalSetPage.propTypes = {
  ...UserPropTypes,
};

export default container(GoalSetPage);
