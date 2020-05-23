import React from 'react';
import { Button, Text } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import GoalOverlay from './GoalOverlay';

const DayHeader = ({
  goalCalories,
  handleMealPress,
  getNewEatenAt,
  user,
  goalCaloriesInput,
  isOverlayVisible,
  onGoalButtonPress,
  setGoalCaloriesInput,
  toggleIsOverlayVisible,
  checkIsNumber,
  isOverlayLoading,
}) => (
  <View>
    <Button
      title="Add a new meal"
      onPress={() =>
        handleMealPress({
          id: null,
          eatenAt: getNewEatenAt(),
          meal: [],
          name: 'Untitled',
          createdAt: new Date(),
          deleted: false,
          uid: user.uid,
        })
      }
    />
    {goalCalories ? <Text>Yes goals</Text> : null}
    <GoalOverlay
      goalCalories={goalCaloriesInput}
      isOverlayVisible={isOverlayVisible}
      onGoalButtonPress={onGoalButtonPress}
      setGoalCalories={setGoalCaloriesInput}
      toggleIsOverlayVisible={toggleIsOverlayVisible}
      onConfirmButtonPress={checkIsNumber}
      loading={isOverlayLoading}
    />
  </View>
);

DayHeader.propTypes = {
  goalCalories: PropTypes.number,
  handleMealPress: PropTypes.func.isRequired,
  getNewEatenAt: PropTypes.func.isRequired,
  user: PropTypes.shape({ uid: PropTypes.string, email: PropTypes.string })
    .isRequired,
  onGoalButtonPress: PropTypes.func.isRequired,
  isOverlayVisible: PropTypes.bool.isRequired,
  toggleIsOverlayVisible: PropTypes.func.isRequired,
  goalCaloriesInput: PropTypes.string.isRequired,
  setGoalCaloriesInput: PropTypes.func.isRequired,
  checkIsNumber: PropTypes.func.isRequired,
  isOverlayLoading: PropTypes.bool.isRequired,
};

export default DayHeader;
