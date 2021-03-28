import React from 'react';
import { Text, Button, Input } from 'react-native-elements';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const GoalPrompt = ({
  toggleIsOverlayVisible,
  goal,
  setGoal,
  onConfirmButtonPress,
  loading,
  clearGoal,
  title,
}) => (
  <View style={styles.overlayContentContainer}>
    <Text h4>{title}</Text>
    <Input
      containerStyle={styles.inputContainer}
      value={goal}
      onChangeText={(value) => setGoal(value)}
      keyboardType="number-pad"
    />
    {loading ? (
      <ActivityIndicator size="large" />
    ) : (
      <View style={styles.buttonContainer}>
        <Button title="Confirm" onPress={onConfirmButtonPress} />
        <Button title="Clear goal" onPress={clearGoal} />
        {toggleIsOverlayVisible && (
          <Button
            title="Cancel"
            onPress={() => toggleIsOverlayVisible(false)}
          />
        )}
      </View>
    )}
  </View>
);

GoalPrompt.propTypes = {
  toggleIsOverlayVisible: PropTypes.func,
  goal: PropTypes.string.isRequired,
  setGoalCalories: PropTypes.func.isRequired,
  onConfirmButtonPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  clearGoal: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  overlayContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    marginVertical: 0,
    marginHorizontal: 0,
    width: 200,
    padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default GoalPrompt;
