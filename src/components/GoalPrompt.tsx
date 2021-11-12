import React from 'react';
import { Text, Button, Input } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import ActivityIndicator from '../components/ActivityIndicator';

const GoalPrompt = ({
  toggleIsOverlayVisible,
  goal,
  setGoal,
  onConfirmButtonPress,
  loading,
  clearGoal,
  title,
}: GoalPromptProps) => (
  <View style={styles.container}>
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

interface GoalPromptProps {
  toggleIsOverlayVisible?: (value: boolean) => void;
  goal?: string;
  onConfirmButtonPress: () => void;
  loading: boolean;
  clearGoal: () => void;
  setGoal: (value: string) => void;
  title: string;
}

const styles = StyleSheet.create({
  container: {
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
