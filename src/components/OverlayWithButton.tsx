import React from 'react';
import { Text, Button, Overlay, Input } from 'react-native-elements';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const OverLayWithButton = ({
  onButtonPress,
  isOverlayVisible,
  toggleIsOverlayVisible,
  inputValue,
  setInputValue,
  onConfirmButtonPress,
  loading,
  header,
  icon,
}) => (
  <View>
    <Button icon={icon} onPress={onButtonPress} />
    <Overlay
      isVisible={isOverlayVisible}
      onBackdropPress={() => toggleIsOverlayVisible(false)}
    >
      <View style={styles.overlayContentContainer}>
        <Text h4>{header}</Text>
        <Input
          containerStyle={styles.inputContainer}
          value={inputValue}
          onChangeText={(value) => setInputValue(value)}
          keyboardType="number-pad"
        />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={onConfirmButtonPress} />
            <Button
              title="Cancel"
              onPress={() => toggleIsOverlayVisible(false)}
            />
          </View>
        )}
      </View>
    </Overlay>
  </View>
);

OverLayWithButton.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  isOverlayVisible: PropTypes.bool.isRequired,
  toggleIsOverlayVisible: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  onConfirmButtonPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  hasGoal: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

const styles = StyleSheet.create({
  overlayContentContainer: {
    justifyContent: 'space-around',
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

export default OverLayWithButton;
