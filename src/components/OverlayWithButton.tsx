import React from 'react';
import { Button, Overlay, Text, Input } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import ActivityIndicator from '../components/ActivityIndicator';

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
  onClear,
}: OverLayWithButtonProps) => (
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
            {!!onClear && <Button title="Clear goal" onPress={onClear} />}
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

interface OverLayWithButtonProps {
  onButtonPress: () => void;
  isOverlayVisible: boolean;
  toggleIsOverlayVisible: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onConfirmButtonPress: () => void;
  loading: boolean;
  header: string;
  icon: JSX.Element;
  onClear?: (value: any) => void;
}

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
