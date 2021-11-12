import React, { useState } from 'react';
import { Button, Icon, Input } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

const UpDownButtons = ({
  total,
  onValueChange,
  hideInput,
}: UpDownButtonsProps) => {
  const [input, setInput] = useState<string | null>(null);

  const handleInputBox = (value: string) => {
    const decimals = value.split('').filter((char) => char === '.');
    if (decimals.length === 1 && value.endsWith('.')) {
      setInput(value);
      onValueChange(null);
    } else {
      setInput(null);
      onValueChange(isNaN(Number(value)) ? '0' : Number(value));
    }
  };

  return (
    <View style={styles.row}>
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        onPress={() => onValueChange(total + 1)}
        icon={<Icon name="arrow-drop-up" />}
      />
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        onPress={() => onValueChange(Math.max(total - 1, 0))}
        disabled={Number(total) <= 0}
        icon={<Icon name="arrow-drop-down" />}
      />
      {!hideInput && (
        <Input
          containerStyle={styles.inputContainer}
          onChangeText={handleInputBox}
          value={input || total?.toString() || '0'}
          inputStyle={styles.input}
          keyboardType="number-pad"
        />
      )}
    </View>
  );
};

interface UpDownButtonsProps {
  total: number;
  onValueChange: (value: any) => void;
  hideInput?: boolean;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  button: {
    margin: 0,
    padding: 0,
  },
  inputContainer: {
    width: 50,
    marginVertical: 0,
    marginHorizontal: 5,
    paddingHorizontal: 0,
  },
  input: {
    textAlign: 'center',
  },
});

export default UpDownButtons;
