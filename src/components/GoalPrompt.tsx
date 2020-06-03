import React from 'react';
import { Text, Button, Input } from 'react-native-elements';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const GoalPrompt = ({
  toggleIsOverlayVisible,
  goalCalories,
  setGoalCalories,
  onConfirmButtonPress,
  loading,
}) => (
  <View style={styles.overlayContentContainer}>
    <Text h3>Let's set a goal!</Text>
    <Text h4>How many calories for today?</Text>
    <Input
      containerStyle={styles.inputContainer}
      value={goalCalories}
      onChangeText={(value) => setGoalCalories(value)}
      keyboardType="number-pad"
    />
    {loading ? (
      <ActivityIndicator size="large" />
    ) : (
      <View style={styles.buttonContainer}>
        <Button title="Confirm" onPress={onConfirmButtonPress} />
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
  goalCalories: PropTypes.string.isRequired,
  setGoalCalories: PropTypes.func.isRequired,
  onConfirmButtonPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  overlayContentContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
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
