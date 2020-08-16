import React from 'react';
import { Button, Overlay } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import GoalPrompt from './GoalPrompt';

const GoalOverlay = ({
  onGoalButtonPress,
  isOverlayVisible,
  toggleIsOverlayVisible,
  goalCalories,
  setGoalCalories,
  onConfirmButtonPress,
  loading,
  hasGoal,
  clearGoal,
}) => (
  <View>
    <Button
      title={hasGoal ? 'Change your day goal' : 'Set a day goal'}
      onPress={onGoalButtonPress}
    />
    <Overlay
      isVisible={isOverlayVisible}
      onBackdropPress={() => toggleIsOverlayVisible(false)}
    >
      <GoalPrompt
        goalCalories={goalCalories}
        loading={loading}
        onConfirmButtonPress={onConfirmButtonPress}
        setGoalCalories={setGoalCalories}
        toggleIsOverlayVisible={toggleIsOverlayVisible}
        clearGoal={clearGoal}
      />
    </Overlay>
  </View>
);

GoalOverlay.propTypes = {
  onGoalButtonPress: PropTypes.func.isRequired,
  isOverlayVisible: PropTypes.bool.isRequired,
  toggleIsOverlayVisible: PropTypes.func.isRequired,
  goalCalories: PropTypes.string.isRequired,
  setGoalCalories: PropTypes.func.isRequired,
  onConfirmButtonPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  hasGoal: PropTypes.bool.isRequired,
  clearGoal: PropTypes.func.isRequired,
};

export default GoalOverlay;
